namespace AppDeclaracion.Api.Auth;

public sealed record RegistroRequest(string Email, string Password, string Nombre, string? Rfc);

public sealed record LoginRequest(string Email, string Password);

public sealed record AuthResponse(string Token);
