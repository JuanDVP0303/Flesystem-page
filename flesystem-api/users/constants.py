OPERATIONS_DICT = [{
        "name": "Rentabilidad",
        "value": "rentability"
    }, 
    {
        "name": "Gastos Fijos / Variables",
        "value": "breakdown_of_expenses"
    },
    {
        "name": "Facturas pendientes",
        "value": "pending_bills"
    },
    {
        "name": "Tienda",
        "value": "store"
    },
    {
        "name": "Dashboard",
        "value": "dashboard"
    },
    ]

PERMISSIONS = {
    value : True for value in [operation["value"] for operation in OPERATIONS_DICT]
}
