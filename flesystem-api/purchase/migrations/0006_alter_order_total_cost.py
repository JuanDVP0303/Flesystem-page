# Generated by Django 5.0.6 on 2025-01-11 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('purchase', '0005_order_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='total_cost',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
