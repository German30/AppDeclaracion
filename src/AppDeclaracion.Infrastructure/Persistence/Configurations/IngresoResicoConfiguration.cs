using AppDeclaracion.Domain.Resico;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class IngresoResicoConfiguration : IEntityTypeConfiguration<IngresoResico>
{
    public void Configure(EntityTypeBuilder<IngresoResico> builder)
    {
        builder.ToTable("ingresos_resico");
        builder.HasKey(i => i.Id);

        builder.HasMany(i => i.Meses)
            .WithOne()
            .HasForeignKey("IngresoResicoId")
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(i => i.Meses).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

public class IngresoMensualResicoConfiguration : IEntityTypeConfiguration<IngresoMensualResico>
{
    public void Configure(EntityTypeBuilder<IngresoMensualResico> builder)
    {
        builder.ToTable("ingresos_mensuales_resico");
        builder.HasKey(m => m.Id);
    }
}
