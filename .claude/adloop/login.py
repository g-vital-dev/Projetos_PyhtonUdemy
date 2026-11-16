"""Login do AdLoop numa sessão de nuvem (container sem navegador).

Uso:
  python3 .claude/adloop/login.py url <arquivo_client_secret.json> [customer_id]
      -> grava ~/.adloop/{credentials.json,config.yaml} e imprime o link de login
  python3 .claude/adloop/login.py code '<endereço http://localhost:8765/?...>'
      -> troca o código pelo token (~/.adloop/token.json)

Nenhuma credencial é gravada no repositório.
"""
import json
import os
import shutil
import sys
from pathlib import Path

HOME = Path.home() / ".adloop"
PENDING = HOME / "pending_login.json"
REDIRECT = "http://localhost:8765/"

CONFIG = """google:
  credentials_path: ~/.adloop/credentials.json
  token_path: ~/.adloop/token.json
ads:
  customer_id: "{customer_id}"
safety:
  max_daily_budget: 50.00
  require_dry_run: true
"""


def _flow(scopes, **kw):
    from google_auth_oauthlib.flow import Flow

    return Flow.from_client_secrets_file(
        str(HOME / "credentials.json"), scopes=scopes, redirect_uri=REDIRECT, **kw
    )


def url(client_file, customer_id=""):
    from adloop.auth import _requested_scopes
    from adloop.config import load_config

    HOME.mkdir(mode=0o700, exist_ok=True)
    shutil.copy(client_file, HOME / "credentials.json")
    os.chmod(HOME / "credentials.json", 0o600)
    cfg = HOME / "config.yaml"
    if customer_id or not cfg.exists():
        cfg.write_text(CONFIG.format(customer_id=customer_id.replace("-", "")))
    scopes = _requested_scopes(load_config())
    flow = _flow(scopes, autogenerate_code_verifier=True)
    link, state = flow.authorization_url(prompt="consent", access_type="offline")
    PENDING.write_text(json.dumps({"state": state, "verifier": flow.code_verifier, "scopes": scopes}))
    os.chmod(PENDING, 0o600)
    print(link)


def code(response_url):
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # redirect para localhost
    os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
    p = json.loads(PENDING.read_text())
    flow = _flow(p["scopes"], state=p["state"])
    flow.code_verifier = p["verifier"]
    flow.fetch_token(authorization_response=response_url)
    creds = flow.credentials
    missing = set(p["scopes"]) - set(creds.scopes or [])
    if missing:
        sys.exit(f"Permissões não concedidas: {', '.join(sorted(missing))}. Refaça o login marcando todas.")
    token = HOME / "token.json"
    token.write_text(creds.to_json())
    os.chmod(token, 0o600)
    PENDING.unlink(missing_ok=True)
    print("Login concluído. Reinicie o servidor MCP 'adloop' (ou a sessão) para usar as ferramentas.")


if __name__ == "__main__":
    cmd, *args = sys.argv[1:] or ["help"]
    {"url": url, "code": code}.get(cmd, lambda *a: print(__doc__))(*args)
