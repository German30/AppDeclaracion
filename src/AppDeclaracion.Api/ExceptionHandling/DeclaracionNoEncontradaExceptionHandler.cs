using AppDeclaracion.Application.Declaraciones;
using Microsoft.AspNetCore.Diagnostics;

namespace AppDeclaracion.Api.ExceptionHandling;

public sealed class DeclaracionNoEncontradaExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not DeclaracionNoEncontradaException)
        {
            return false;
        }

        httpContext.Response.StatusCode = StatusCodes.Status404NotFound;
        await httpContext.Response.WriteAsJsonAsync(new { error = exception.Message }, cancellationToken);
        return true;
    }
}
