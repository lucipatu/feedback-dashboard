-- ============================================================
-- CapyFi Feedback Dashboard — Schema de Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. Crear la tabla
create table if not exists feedbacks (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  text        text not null,
  source      text not null,
  sentiment   text not null check (sentiment in ('positivo', 'negativo', 'neutral')),
  category    text not null,
  insight     text not null default '',
  score       integer not null default 0 check (score >= -100 and score <= 100)
);

-- 2. Habilitar Row Level Security
alter table feedbacks enable row level security;

-- 3. Políticas — acceso público (anon key) para leer, insertar y eliminar
create policy "Allow public select"
  on feedbacks for select using (true);

create policy "Allow public insert"
  on feedbacks for insert with check (true);

create policy "Allow public delete"
  on feedbacks for delete using (true);

-- ============================================================
-- Seed data — 12 feedbacks de ejemplo
-- (Opcional: ejecutar solo si la tabla está vacía)
-- ============================================================

insert into feedbacks (text, source, sentiment, category, insight, score) values
  ('La app es increíble. Las transferencias son instantáneas y la interfaz es súper intuitiva. ¡La mejor fintech que usé!', 'Twitter', 'positivo', 'UX / Diseño', 'Alta satisfacción con la velocidad de transferencias y usabilidad.', 92),
  ('Tuve problemas para verificar mi identidad. El proceso tardó 3 días y el soporte no me respondió a tiempo.', 'Email / Form', 'negativo', 'Onboarding', 'Fricción crítica en verificación de identidad y soporte lento.', -74),
  ('Me encanta el diseño y la facilidad de uso. Solo mejoraría las notificaciones push, a veces llegan tarde.', 'Discord', 'positivo', 'Features', 'Elogio al diseño con punto de mejora en notificaciones push.', 61),
  ('La app se cierra sola cuando intento pagar con QR en negocios. Pasó tres veces esta semana.', 'Twitter', 'negativo', 'Bug', 'Bug crítico recurrente en pagos QR que impacta la experiencia de pago.', -85),
  ('Excelente la función de inversiones automáticas. El rendimiento está muy por encima de los bancos tradicionales.', 'Email / Form', 'positivo', 'Features', 'Inversiones automáticas percibidas como diferencial competitivo clave.', 88),
  ('La comisión del 1.5% en transferencias internacionales me parece alta comparado con otras opciones del mercado.', 'Discord', 'negativo', 'Pricing', 'Precio de transferencias internacionales percibido como poco competitivo.', -42),
  ('Funciona bien en general pero la app tarda bastante en cargar el saldo cuando entro por la mañana.', 'Twitter', 'neutral', 'Performance', 'Latencia en carga de saldo durante horario pico matutino.', -18),
  ('El onboarding mejoró mucho desde la última actualización. Ahora verificar la cuenta tarda 10 minutos.', 'Discord', 'positivo', 'Onboarding', 'Mejora significativa percibida en velocidad de verificación post-update.', 76),
  ('Estaría bueno poder programar pagos recurrentes. Ahora tengo que hacerlos manualmente todos los meses.', 'Email / Form', 'neutral', 'Features', 'Demanda clara de pagos automáticos recurrentes como feature prioritario.', 5),
  ('El modo oscuro se ve genial. Ojalá tuvieran también widgets para la pantalla de inicio del celular.', 'Twitter', 'positivo', 'UX / Diseño', 'Diseño valorado positivamente; demanda de widgets como extensión natural.', 55),
  ('Me bloquearon la cuenta sin previo aviso y llevo 2 días sin poder acceder. Necesito mi dinero urgente.', 'Email / Form', 'negativo', 'General', 'Bloqueo de cuenta sin notificación genera situación crítica para el usuario.', -96),
  ('La tasa de ahorro del 9% anual es muy competitiva. Moví todos mis ahorros acá desde el banco.', 'Discord', 'positivo', 'Pricing', 'Tasa de ahorro percibida como diferencial que impulsa migración desde bancos.', 90);
