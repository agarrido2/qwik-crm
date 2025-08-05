
# CRM Database Schema (PostgreSQL / Supabase)
> **Estructura completa y comentada, alineada con el mecanismo de tu CRM**

---

## 1. Tabla de Tipos de Entidad

```sql
-- Tipos posibles: empresa, persona, gobierno, ONG, etc.
CREATE TABLE entity_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
```

---

## 2. Tabla Principal de Entidades

```sql
-- Almacena cualquier actor del CRM: cliente, proveedor, partner, etc.
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  type_id INTEGER REFERENCES entity_type(id) NOT NULL,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deactivation_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- activo, bloqueado, suspendido
  tax_id VARCHAR(20),
  company_name VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address VARCHAR(255),
  address_extension VARCHAR(100),
  contact_email VARCHAR(255),
  personal_email VARCHAR(255),
  website VARCHAR(255),
  contact_name VARCHAR(100),
  contact_mobile VARCHAR(30),
  personal_mobile VARCHAR(30),
  notes JSONB,
  default_payment_method_id INTEGER REFERENCES payment_methods(id), -- Preferencia de pago habitual
  CONSTRAINT entities_status_chk CHECK (status IN ('active', 'blocked', 'suspended'))
);
```

---

## 3. Tabla de Roles de Entidad

```sql
-- Define roles que puede tener una entidad: customer, supplier, broker, partner, etc.
CREATE TABLE entity_role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
```

---

## 4. Relación N:M Entidad ↔ Rol

```sql
-- Permite que una entidad tenga varios roles (cliente y proveedor, por ejemplo).
CREATE TABLE entity_has_role (
  entity_id INTEGER REFERENCES entities(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES entity_role(id) ON DELETE CASCADE,
  since DATE NOT NULL DEFAULT CURRENT_DATE,
  extra_data JSONB,  -- Info adicional específica para el rol
  PRIMARY KEY (entity_id, role_id)
);
```

---

## 5. Tabla de Métodos de Pago

```sql
-- Define los métodos de pago disponibles y su estructura dinámica.
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,            -- bank transfer, credit card, etc.
  description TEXT,
  due_days INTEGER DEFAULT 0,
  surcharge NUMERIC(8,2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  details_schema JSONB
);

-- Ejemplo de inserciones iniciales:
INSERT INTO payment_methods (name, description, due_days, details_schema) VALUES
  (
    'bank transfer',
    'Standard SEPA bank transfer',
    30,
    '{"fields": ["iban", "swift", "bank_name"]}'
  ),
  (
    'credit card',
    'Payment by credit/debit card, supports installments',
    0,
    '{"fields": ["card_number", "expiry", "holder", "installments"]}'
  ),
  (
    'cash',
    'Cash payment at office or delivery',
    0,
    '{"fields": []}'
  ),
  (
    'installments',
    'Payment in monthly installments',
    30,
    '{"fields": ["frequency", "total_installments", "first_due_date"]}'
  );
```

---

## 6. Tabla de Empresas (Organizations / Companies)

```sql
-- Define las empresas que gestionan la app (multi-tenant).
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(30),
  address VARCHAR(255),
  phone VARCHAR(30),
  email VARCHAR(255),
  notes TEXT
);
```

---

## 7. Tabla de Facturas (Invoices)

```sql
-- Cabecera de factura
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(30) NOT NULL,                    -- Número legal/secuencial
  issued_at TIMESTAMP NOT NULL,                           -- Fecha de emisión (con hora)
  created_by INTEGER NOT NULL,                            -- ID usuario que crea la factura
  entity_id INTEGER NOT NULL REFERENCES entities(id),     -- Cliente o destinatario
  company_id INTEGER NOT NULL REFERENCES companies(id),   -- Empresa emisora
  status VARCHAR(20) NOT NULL DEFAULT 'issued',           -- draft, issued, cancelled, paid, etc.
  total NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  notes TEXT,
  due_date DATE,
  paid_at TIMESTAMP,
  pdf_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  payment_method_id INTEGER REFERENCES payment_methods(id), -- Método de pago usado en la factura
  payment_terms TEXT,                                       -- Condiciones específicas de pago
  payment_details JSONB                                     -- Detalles variables (IBAN, tarjeta, cuotas, etc)
);
```

---

## 8. Ejemplo: Inserciones de Facturas con Detalles de Pago (JSONB)

```sql
-- Factura por transferencia bancaria
INSERT INTO invoices (
  invoice_number, issued_at, created_by, entity_id, company_id,
  status, total, currency, notes, due_date, payment_method_id, payment_terms, payment_details
) VALUES (
  '2024-0012', '2024-08-01 10:30:00', 2, 1, 1,
  'issued', 1200.00, 'EUR', 'Pago pendiente de transferencia', '2024-08-31',
  1, 'Pago por transferencia bancaria en 30 días',
  '{"iban": "ES91 2100 0418 4502 0005 1332", "swift": "CAIXESBBXXX", "bank_name": "CaixaBank"}'
);

-- Factura por tarjeta, 3 cuotas
INSERT INTO invoices (
  invoice_number, issued_at, created_by, entity_id, company_id,
  status, total, currency, notes, due_date, payment_method_id, payment_terms, payment_details
) VALUES (
  '2024-0013', '2024-08-02 12:00:00', 3, 2, 1,
  'issued', 600.00, 'EUR', 'Pago con tarjeta, 3 cuotas', '2024-09-02',
  2, 'Pago con tarjeta en 3 cuotas',
  '{"card_number": "**** **** **** 1234", "expiry": "12/27", "holder": "Antonio G.", "installments": 3}'
);

-- Factura a plazos mensuales
INSERT INTO invoices (
  invoice_number, issued_at, created_by, entity_id, company_id,
  status, total, currency, notes, due_date, payment_method_id, payment_terms, payment_details
) VALUES (
  '2024-0014', '2024-08-03 16:15:00', 1, 3, 1,
  'issued', 2400.00, 'EUR', 'Pago fraccionado en 12 meses', '2025-08-03',
  4, 'Pago en 12 cuotas mensuales',
  '{"frequency": "monthly", "total_installments": 12, "first_due_date": "2024-09-03"}'
);
```

---

### Índices recomendados para performance (opcionales):

```sql
CREATE INDEX idx_entities_status ON entities(status);
CREATE INDEX idx_entity_has_role_role ON entity_has_role(role_id);
CREATE INDEX idx_entity_has_role_entity ON entity_has_role(entity_id);
CREATE INDEX idx_invoices_payment_method ON invoices(payment_method_id);
```
