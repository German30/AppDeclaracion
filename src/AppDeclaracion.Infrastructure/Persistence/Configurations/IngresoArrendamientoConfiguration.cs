using AppDeclaracion.Domain.Arrendamiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class IngresoArrendamientoConfiguration : IEntityTypeConfiguration<IngresoArrendamiento>
{
    public void Configure(EntityTypeBuilder<IngresoArrendamiento> builder)
    {
        builder.ToTable("ingresos_arrendamiento");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.TipoDeduccion).HasConversion<string>().HasMaxLength(30);

        builder.HasMany(i => i.Deducciones)
            .WithOne()
            .HasForeignKey(d => d.IngresoArrendamientoId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(i => i.Deducciones).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

public class DeduccionArrendamientoConfiguration : IEntityTypeConfiguration<DeduccionArrendamiento>
{
    public void Configure(EntityTypeBuilder<DeduccionArrendamiento> builder)
    {
        builder.ToTable("deducciones_arrendamiento");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Concepto).IsRequired().HasMaxLength(200);
    }
}
