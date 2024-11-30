# Generated by Django 5.1.3 on 2024-11-28 04:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_oferta'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('agente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversaciones_agente', to=settings.AUTH_USER_MODEL)),
                ('comprador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversaciones_comprador', to=settings.AUTH_USER_MODEL)),
                ('propiedad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.propiedad')),
            ],
            options={
                'db_table': 'conversaciones',
            },
        ),
        migrations.CreateModel(
            name='Mensaje',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.TextField()),
                ('fecha_envio', models.DateTimeField(auto_now_add=True)),
                ('conversacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensajes', to='core.conversacion')),
                ('remitente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'mensajes',
            },
        ),
    ]
