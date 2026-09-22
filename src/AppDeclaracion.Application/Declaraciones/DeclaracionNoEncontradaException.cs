namespace AppDeclaracion.Application.Declaraciones;

public sealed class DeclaracionNoEncontradaException(Guid id)
    : Exception($"No se encontró la declaración '{id}' para el usuario autenticado.");
