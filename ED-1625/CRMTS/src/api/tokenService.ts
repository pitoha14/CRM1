class TokenStorage {
  private accessToken: string | null = null;

  public setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public clearAccessToken(): void {
    this.accessToken = null;
  }
}

const tokenStorage = new TokenStorage();

export function setAccessToken(token: string | null) {
  tokenStorage.setAccessToken(token);
}

export function getAccessToken(): string | null {
  return tokenStorage.getAccessToken();
}

export function clearAccessToken() {
  tokenStorage.clearAccessToken();
}