# Generated by Django 5.0.6 on 2024-12-29 19:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_account_kind_of_person'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='credits',
        ),
    ]
