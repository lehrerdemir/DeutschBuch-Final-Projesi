#!/bin/bash

# DeutschBuch v2 - Optimiertes Setup Skript
# Dieses Skript installiert und konfiguriert das gesamte Projekt

set -e

echo "================================"
echo "DeutschBuch v2 - Setup"
echo "================================"
echo ""

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Überprüfe Node.js Installation
echo -e "${BLUE}[1/6]${NC} Überprüfe Node.js Installation..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js nicht gefunden. Bitte installieren Sie Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) gefunden${NC}"

# 2. Installiere Frontend Dependencies
echo ""
echo -e "${BLUE}[2/6]${NC} Installiere Frontend Dependencies..."
cd frontend
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Frontend Dependencies installiert${NC}"

# 3. Installiere Backend Dependencies
echo ""
echo -e "${BLUE}[3/6]${NC} Überprüfe Backend..."
cd ../backend
if [ -f "pom.xml" ]; then
    echo -e "${YELLOW}Maven Projekt erkannt. Bitte führen Sie 'mvn clean install' manuell aus.${NC}"
else
    echo -e "${YELLOW}Backend Setup erforderlich${NC}"
fi
cd ..

# 4. Überprüfe Datenbank
echo ""
echo -e "${BLUE}[4/6]${NC} Überprüfe Datenbank-Konfiguration..."
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓ Docker Compose Datei gefunden${NC}"
    echo -e "${YELLOW}Starten Sie die Datenbank mit: docker-compose up -d${NC}"
else
    echo -e "${YELLOW}Docker Compose nicht gefunden${NC}"
fi

# 5. Konfiguriere Umgebungsvariablen
echo ""
echo -e "${BLUE}[5/6]${NC} Überprüfe Umgebungsvariablen..."
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}Erstelle .env Datei...${NC}"
    cat > frontend/.env << EOF
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_DEMO_MODE=true
EOF
    echo -e "${GREEN}✓ .env Datei erstellt${NC}"
else
    echo -e "${GREEN}✓ .env Datei existiert${NC}"
fi

# 6. Zusammenfassung
echo ""
echo -e "${BLUE}[6/6]${NC} Setup abgeschlossen!"
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup erfolgreich abgeschlossen!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Nächste Schritte:"
echo "1. Starten Sie die Datenbank:"
echo "   cd $(pwd) && docker-compose up -d"
echo ""
echo "2. Starten Sie das Backend:"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo "3. Starten Sie das Frontend (in neuem Terminal):"
echo "   cd frontend && npm start"
echo ""
echo "4. Öffnen Sie http://localhost:3000 im Browser"
echo ""
echo "Weitere Informationen: OPTIMIZATION_GUIDE.md"
