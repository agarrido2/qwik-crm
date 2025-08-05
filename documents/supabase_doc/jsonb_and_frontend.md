
# JSONB en PostgreSQL y su uso desde el Frontend (React)

---

## ¿Qué es JSONB?

- **JSONB** es un tipo de columna nativo de PostgreSQL que permite almacenar datos estructurados (JSON) de forma eficiente, indexable y consultable.
- Es perfecto para cuando necesitas flexibilidad:  
  Ejemplo: detalles de pago, configuraciones, campos variables según el caso de uso.

---

### Ventajas de usar JSONB

- **Flexibilidad:**  
  Guarda cualquier estructura de datos (objetos, arrays) sin tener que modificar la tabla cada vez.
- **Consultable:**  
  Puedes hacer búsquedas, filtrados y operaciones sobre el contenido JSON directamente en SQL.
- **Performance:**  
  Permite crear índices sobre campos internos para acelerar búsquedas.
- **Compatibilidad:**  
  Frontend y backend pueden manejar el JSON tal cual, sin transformación adicional.

---

## Consultas SQL con JSONB

**Extraer datos concretos:**

```sql
-- Buscar facturas pagadas con un IBAN concreto
SELECT * FROM invoices
WHERE payment_details->>'iban' = 'ES91 2100 0418 4502 0005 1332';

-- Buscar facturas por número de cuotas
SELECT * FROM invoices
WHERE (payment_details->>'installments')::int = 3;
```

**Indexar campos internos:**

```sql
-- Índice para búsquedas rápidas por IBAN
CREATE INDEX idx_invoices_payment_iban ON invoices ((payment_details->>'iban'));
```

---

## Uso de JSONB desde el Frontend (React)

### 1. **Obtener y mostrar detalles dinámicos de pago**

Supón que traes una factura desde Supabase (o API REST):

```js
// Ejemplo de respuesta desde Supabase
const invoice = {
  invoice_number: "2024-0012",
  payment_method_id: 1,
  payment_details: {
    iban: "ES91 2100 0418 4502 0005 1332",
    swift: "CAIXESBBXXX",
    bank_name: "CaixaBank"
  }
};
```

### 2. **Mostrar campos variables en React**

```jsx
function PaymentDetails({ paymentDetails }) {
  if (!paymentDetails) return null;

  if (paymentDetails.iban) {
    // Transferencia bancaria
    return (
      <div>
        <div><strong>IBAN:</strong> {paymentDetails.iban}</div>
        <div><strong>SWIFT:</strong> {paymentDetails.swift}</div>
        <div><strong>Banco:</strong> {paymentDetails.bank_name}</div>
      </div>
    );
  }
  if (paymentDetails.card_number) {
    // Tarjeta de crédito
    return (
      <div>
        <div><strong>Tarjeta:</strong> {paymentDetails.card_number}</div>
        <div><strong>Vence:</strong> {paymentDetails.expiry}</div>
        <div><strong>Titular:</strong> {paymentDetails.holder}</div>
        <div><strong>Cuotas:</strong> {paymentDetails.installments}</div>
      </div>
    );
  }
  // ...otros tipos
  return <div>Detalles de pago no disponibles</div>;
}
```

### 3. **Formulario dinámico para editar datos JSONB**

Puedes generar los campos de un formulario en función del método de pago seleccionado:

```jsx
function PaymentForm({ paymentMethod, paymentDetails, setPaymentDetails }) {
  if (!paymentMethod) return null;

  // paymentMethod.details_schema example: {fields: ["iban", "swift", "bank_name"]}
  return (
    <form>
      {paymentMethod.details_schema.fields.map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input
            type="text"
            value={paymentDetails[field] || ''}
            onChange={e =>
              setPaymentDetails(prev => ({ ...prev, [field]: e.target.value }))
            }
          />
        </div>
      ))}
    </form>
  );
}
```

### 4. **Enviar y guardar datos en JSONB**

Cuando envías el formulario, envías todo el objeto `paymentDetails` al backend, y lo guardas directamente en el campo JSONB de la factura.

---

## **Resumen**

- JSONB te da flexibilidad total y es perfecto para escenarios con datos variables por caso de uso.
- En el frontend, manipulas el campo como cualquier objeto JS/JSON, tanto para mostrar como para guardar.
- Si tienes requisitos nuevos (Bizum, PayPal, nuevos bancos), solo cambias el frontend y la estructura que guardas en el JSON.

---

> ¿Quieres ejemplos de validación, actualización o queries avanzadas?  
> ¿O una demo con Supabase-js (fetch y guardado de JSONB)?  
> ¡Solo dilo!
