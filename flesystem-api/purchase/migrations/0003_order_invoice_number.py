# Generated by Django 5.0.6 on 2025-01-11 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('purchase', '0002_order_orderitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='invoice_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
