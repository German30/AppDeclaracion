namespace AppDeclaracion.Application.Abstractions;

public interface IJwtTokenService
{
    string GenerarToken(Guid usuarioId, string email);
}
