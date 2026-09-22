using AppDeclaracion.Domain.Declaraciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class DeduccionPersonalConfiguration : IEntityTypeConfiguration<DeduccionPersonal>
{
    public void Configure(EntityTypeBuilder<DeduccionPersonal> builder)
    {
        builder.ToTable("deducciones_personales");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Tipo).HasConversion<string>().HasMaxLength(50);
    }
}
