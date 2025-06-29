-- Location: supabase/migrations/20241216120000_rail_tracker_system.sql
-- Real-Time Rail Tracker System - Complete Database Schema

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'public_user');
CREATE TYPE public.alert_level AS ENUM ('info', 'warning', 'critical');
CREATE TYPE public.train_status AS ENUM ('on-time', 'delayed', 'cancelled');

-- Critical intermediary table for auth relationships
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'public_user'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stations table
CREATE TABLE public.stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trains table
CREATE TABLE public.trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_identifier TEXT NOT NULL,
    direction TEXT NOT NULL,
    start_station_id UUID REFERENCES public.stations(id) ON DELETE RESTRICT,
    destination_station_id UUID REFERENCES public.stations(id) ON DELETE RESTRICT,
    current_station_id UUID REFERENCES public.stations(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    eta TIMESTAMPTZ NOT NULL,
    is_delayed BOOLEAN DEFAULT false,
    live_latitude DECIMAL(10, 8),
    live_longitude DECIMAL(11, 8),
    status public.train_status DEFAULT 'on-time'::public.train_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    alert_level public.alert_level NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_stations_location ON public.stations(latitude, longitude);
CREATE INDEX idx_trains_status ON public.trains(status);
CREATE INDEX idx_trains_current_station ON public.trains(current_station_id);
CREATE INDEX idx_trains_destination ON public.trains(destination_station_id);
CREATE INDEX idx_alerts_level ON public.alerts(alert_level);
CREATE INDEX idx_alerts_active ON public.alerts(is_active);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'public_user')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trains_updated_at
    BEFORE UPDATE ON public.trains
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. RLS Policies

-- User profiles - users can view own profile, admins can view all
CREATE POLICY "users_view_own_profile" ON public.user_profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_profile" ON public.user_profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Stations - public read access, admin write access
CREATE POLICY "public_can_read_stations" ON public.stations
FOR SELECT TO public USING (true);

CREATE POLICY "admin_manage_stations" ON public.stations
FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Trains - public read access, admin write access
CREATE POLICY "public_can_read_trains" ON public.trains
FOR SELECT TO public USING (true);

CREATE POLICY "admin_manage_trains" ON public.trains
FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Alerts - public read active alerts, admin full access
CREATE POLICY "public_can_read_active_alerts" ON public.alerts
FOR SELECT TO public USING (is_active = true);

CREATE POLICY "admin_manage_alerts" ON public.alerts
FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    station1_id UUID := gen_random_uuid();
    station2_id UUID := gen_random_uuid();
    station3_id UUID := gen_random_uuid();
    station4_id UUID := gen_random_uuid();
    station5_id UUID := gen_random_uuid();
    station6_id UUID := gen_random_uuid();
    train1_id UUID := gen_random_uuid();
    train2_id UUID := gen_random_uuid();
    train3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@railtracker.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@example.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Public User", "role": "public_user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create stations
    INSERT INTO public.stations (id, name, latitude, longitude) VALUES
        (station1_id, 'Union Station', 34.0549, -118.2426),
        (station2_id, 'Downtown Terminal', 34.0522, -118.2437),
        (station3_id, 'Airport Junction', 33.9425, -118.4081),
        (station4_id, 'University Campus', 34.0689, -118.4452),
        (station5_id, 'Business District', 34.0407, -118.2468),
        (station6_id, 'Shopping Mall', 34.0194, -118.4912);

    -- Create trains
    INSERT INTO public.trains (
        id, train_identifier, direction, start_station_id, destination_station_id,
        current_station_id, start_time, eta, is_delayed, live_latitude, live_longitude, status
    ) VALUES
        (train1_id, 'Blue Line #55', 'Northbound', station1_id, station3_id, station2_id,
         CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP + INTERVAL '15 minutes',
         false, 34.0522, -118.2437, 'on-time'::public.train_status),
        (train2_id, 'Red Line #23', 'Southbound', station4_id, station5_id, station4_id,
         CURRENT_TIMESTAMP - INTERVAL '45 minutes', CURRENT_TIMESTAMP + INTERVAL '8 minutes',
         true, 34.0689, -118.4452, 'delayed'::public.train_status),
        (train3_id, 'Green Line #77', 'Westbound', station2_id, station6_id, station5_id,
         CURRENT_TIMESTAMP - INTERVAL '20 minutes', CURRENT_TIMESTAMP + INTERVAL '25 minutes',
         false, 34.0407, -118.2468, 'on-time'::public.train_status);

    -- Create alerts
    INSERT INTO public.alerts (message, alert_level, is_active) VALUES
        ('Service disruption on the Red Line due to maintenance. Delays expected.', 'critical'::public.alert_level, true),
        ('Blue Line experiencing minor delays during rush hour.', 'warning'::public.alert_level, true),
        ('Weekend schedule in effect. Trains running every 15 minutes.', 'info'::public.alert_level, true);
END $$;

-- 7. Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.trains;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stations;