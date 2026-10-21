package com.maximize.academy;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.Executors;

/**
 * Backend Java per Maximize Academy.
 * Fornisce micro-servizi RESTful per:
 * 1. Health check & status
 * 2. Barber Reset Business Audit (Algoritmo proprietario di calcolo ROI e ottimizzazione poltrona)
 * 3. Lead Management & Export CSV
 */
public class MaximizeAcademyServer {

    private static final int PORT = 8085;
    private static final String LEADS_FILE = "leads_repository.csv";

    public static void main(String[] args) {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
            
            // Configura Handlers
            server.createContext("/api/java/health", new HealthHandler());
            server.createContext("/api/java/barber-audit", new BarberAuditHandler());
            server.createContext("/api/java/lead", new LeadHandler());
            server.createContext("/api/java/leads", new GetLeadsHandler());

            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("==================================================");
            System.out.println("  MAXIMIZE ACADEMY - BACKEND JAVA ATTIVO");
            System.out.println("  Porta HTTP: " + PORT);
            System.out.println("  Endpoint Health: http://localhost:" + PORT + "/api/java/health");
            System.out.println("  Endpoint Audit:  http://localhost:" + PORT + "/api/java/barber-audit");
            System.out.println("==================================================");
            
            // Inizializza file lead se non esiste
            initLeadsFile();

        } catch (IOException e) {
            System.err.println("Errore avvio server Java: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void initLeadsFile() {
        File file = new File(LEADS_FILE);
        if (!file.exists()) {
            try (FileWriter writer = new FileWriter(file, true)) {
                writer.write("Timestamp,Nome,Telefono,Email,Tipologia,Messaggio,NoteAudit\n");
            } catch (IOException e) {
                System.err.println("Impossibile creare leads_repository.csv: " + e.getMessage());
            }
        }
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        setCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    /**
     * Health Handler
     */
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String json = "{"
                    + "\"status\":\"ONLINE\","
                    + "\"service\":\"Maximize Academy Java Microservice\","
                    + "\"version\":\"2.4.0\","
                    + "\"timestamp\":\"" + LocalDateTime.now() + "\","
                    + "\"author\":\"Maurizio Pizzuto Architecture\""
                    + "}";
            sendJsonResponse(exchange, 200, json);
        }
    }

    /**
     * Calcolatore Algoritmo Barber Reset Audit
     * Calcola la dispersione di fatturato attuale e il potenziale di crescita con Barber Reset
     */
    static class BarberAuditHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Metodo non consentito\"}");
                return;
            }

            // Leggi Body
            String body = readRequestBody(exchange);
            
            // Parsing semplice parametri
            int chairs = parseJsonInt(body, "chairs", 2);
            int weeklyClients = parseJsonInt(body, "weeklyClients", 120);
            double avgTicket = parseJsonDouble(body, "avgTicket", 22.0);
            int monthlyProductsSold = parseJsonInt(body, "monthlyProductsSold", 15);

            // Calcoli Business Barberia
            double currentMonthlyRevenue = (weeklyClients * 4.33 * avgTicket) + (monthlyProductsSold * 25.0);
            double projectedTicket = avgTicket * 1.28; // +28% con cross-selling e consulenza
            double projectedProductSales = weeklyClients * 4.33 * 0.18; // 18% di conversione clienti su retail
            double projectedMonthlyRevenue = (weeklyClients * 4.33 * projectedTicket) + (projectedProductSales * 26.0);
            double monthlyUplift = projectedMonthlyRevenue - currentMonthlyRevenue;
            double annualUplift = monthlyUplift * 12.0;

            int resetScore = 65;
            if (avgTicket < 20) resetScore += 15;
            if (monthlyProductsSold < 20) resetScore += 15;

            String json = String.format(java.util.Locale.US, "{"
                    + "\"status\":\"SUCCESS\","
                    + "\"chairs\":%d,"
                    + "\"currentMonthlyRevenue\":%.2f,"
                    + "\"projectedMonthlyRevenue\":%.2f,"
                    + "\"monthlyUplift\":%.2f,"
                    + "\"annualUplift\":%.2f,"
                    + "\"resetNeedScore\":%d,"
                    + "\"strategy\":\"BARBER RESET STRATEGY\","
                    + "\"summary\":\"Con l'intervento Barber Reset su protocolli di consulenza e vendita prodotti, la tua barberia ha un potenziale recuperabile stimato in € %.2f all'anno.\""
                    + "}", chairs, currentMonthlyRevenue, projectedMonthlyRevenue, monthlyUplift, annualUplift, resetScore, annualUplift);

            sendJsonResponse(exchange, 200, json);
        }
    }

    /**
     * Handler Registrazione Lead
     */
    static class LeadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Metodo non consentito\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String name = parseJsonString(body, "name", "Anonimo");
            String phone = parseJsonString(body, "phone", "-");
            String email = parseJsonString(body, "email", "-");
            String type = parseJsonString(body, "type", "Info Generale");
            String message = parseJsonString(body, "message", "").replace(",", ";").replace("\n", " ");
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            // Salva su CSV
            synchronized (MaximizeAcademyServer.class) {
                try (FileWriter writer = new FileWriter(LEADS_FILE, true)) {
                    writer.write(String.format("%s,%s,%s,%s,%s,%s,\n", timestamp, name, phone, email, type, message));
                }
            }

            System.out.println("[JAVA BACKEND] Nuovo Lead Registrato: " + name + " (" + type + ") - Tel: " + phone);

            String json = "{"
                    + "\"status\":\"SAVED\","
                    + "\"message\":\"Lead registrato con successo nel sistema Maximize Academy\","
                    + "\"timestamp\":\"" + timestamp + "\""
                    + "}";
            sendJsonResponse(exchange, 200, json);
        }
    }

    /**
     * Handler Recupero Lead
     */
    static class GetLeadsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                setCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            File file = new File(LEADS_FILE);
            long count = 0;
            if (file.exists()) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(new java.io.FileInputStream(file), StandardCharsets.UTF_8))) {
                    while (reader.readLine() != null) {
                        count++;
                    }
                    if (count > 0) count--; // escludi intestazione
                }
            }

            String json = "{"
                    + "\"status\":\"OK\","
                    + "\"totalLeads\":" + count + ","
                    + "\"storageFile\":\"" + LEADS_FILE + "\""
                    + "}";
            sendJsonResponse(exchange, 200, json);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }

    private static int parseJsonInt(String json, String key, int defaultValue) {
        try {
            String pattern = "\"" + key + "\":";
            int idx = json.indexOf(pattern);
            if (idx == -1) return defaultValue;
            int start = idx + pattern.length();
            while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '\"')) start++;
            int end = start;
            while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '-')) end++;
            return Integer.parseInt(json.substring(start, end));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private static double parseJsonDouble(String json, String key, double defaultValue) {
        try {
            String pattern = "\"" + key + "\":";
            int idx = json.indexOf(pattern);
            if (idx == -1) return defaultValue;
            int start = idx + pattern.length();
            while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '\"')) start++;
            int end = start;
            while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.' || json.charAt(end) == '-')) end++;
            return Double.parseDouble(json.substring(start, end));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private static String parseJsonString(String json, String key, String defaultValue) {
        try {
            String pattern = "\"" + key + "\":\"";
            int idx = json.indexOf(pattern);
            if (idx == -1) {
                // fallback pattern senza apici di inizio
                pattern = "\"" + key + "\":";
                idx = json.indexOf(pattern);
                if (idx == -1) return defaultValue;
            }
            int start = idx + pattern.length();
            if (json.charAt(start - 1) != '\"') {
                while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '\"')) start++;
            }
            int end = json.indexOf("\"", start);
            if (end == -1) {
                end = json.indexOf(",", start);
                if (end == -1) end = json.indexOf("}", start);
            }
            return json.substring(start, end).trim();
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
