using AppDeclaracion.Domain.SueldosYSalarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class IngresoSueldosConfiguration : IEntityTypeConfiguration<IngresoSueldos>
{
    public void Configure(EntityTypeBuilder<IngresoSueldos> builder)
    {
        builder.ToTable("ingresos_sueldos");
        builder.HasKey(i => i.Id);
    }
}
