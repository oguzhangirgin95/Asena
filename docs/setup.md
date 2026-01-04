# Asena – Kurulum ve Çalıştırma (Backend + Frontend)

Bu repo iki ana parçadan oluşur:

- **Backend:** Spring Boot (Java) – `backend/`
- **Frontend:** Angular + Nx – `frontend/`

Aşağıdaki adımlar Windows (PowerShell) odaklı yazılmıştır.

---

## Gereksinimler

### Backend için

- **JDK 21** (projede `backend/pom.xml` içinde `java.version=21`)
- Maven:
  - Tercihen repodaki **bundled Maven**: `tools/apache-maven-3.9.6/`
  - Alternatif: Sistemde Maven yüklü olabilir (opsiyonel)

### Frontend için

- **Node.js (önerilen: 20 LTS)**
- **npm** (Node ile gelir)

Not: Frontend Nx kullanır ve komutlar `frontend/package.json` altında tanımlıdır.

---

## Projeyi ilk kez ayağa kaldırma

## Ortak Environment Dosyası

Bu projede **tek kaynak** environment dosyası vardır:

- `config/environment.json`

Hem **backend** hem **frontend** bu dosyayı kullanır:

- Frontend runtime’da `/environment.json` üzerinden okur (build/serve sırasında `config/environment.json` asset olarak kopyalanır).
- Backend startup sırasında dosyayı okumayı dener (bulamazsa varsayılanlarla devam eder).

Önemli alanlar:

- `environment`: `local | dev | test | prod`
- `api.basePath`: Frontend OpenAPI client base path.
  - Local dev + Angular proxy için önerilen değer: `""`
  - Backend’e direkt gitmek istersen: `"http://localhost:8080"`
- `cors.allowedOrigins`: Backend CORS allowlist.
- `security.jwt.*`: JWT expiration/secret (prod ortamında secret mutlaka değiştirilmelidir).

### 1) Repo kökünde (opsiyonel)

Bu repo root’ta sadece sınırlı tooling var; asıl bağımlılıklar `frontend/` ve `backend/` altında.

### 2) Frontend bağımlılıklarını yükle

PowerShell:

```powershell
cd C:\Projects\Framework\Asena\frontend
npm install
```

### 3) Backend’i çalıştır

Seçenek A (önerilen): VS Code Task

- `Terminal -> Run Task...` → **Run Backend**

Seçenek B: Komut satırı

```powershell
cd C:\Projects\Framework\Asena\backend
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot"
C:\Projects\Framework\Asena\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

Backend ayağa kalkınca tipik adresler:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI: `http://localhost:8080/v3/api-docs`

> Port `application.properties` içinde override edilmemişse Spring Boot varsayılanı olan **8080** kullanılır.

### 4) Frontend’i çalıştır

Seçenek A (önerilen): VS Code Task

- `Terminal -> Run Task...` → **Run Frontend**

Seçenek B: Komut satırı

```powershell
cd C:\Projects\Framework\Asena\frontend
npm start
```

Bu komut `nx serve web` çalıştırır.

Frontend, backend’e giden istekler için proxy kullanır:

- `frontend/apps/web/proxy.conf.json` içindeki ayar ile `/api` istekleri `http://localhost:8080` hedefine gider.

---

## Sık kullanılan komutlar

### Frontend

```powershell
cd C:\Projects\Framework\Asena\frontend

# Dev server
npm start

# Test
npx nx test web

# Lint
npx nx lint web

# Build
npx nx build web
```

### Backend

```powershell
cd C:\Projects\Framework\Asena\backend

# Test
C:\Projects\Framework\Asena\tools\apache-maven-3.9.6\bin\mvn.cmd test

# Paket
C:\Projects\Framework\Asena\tools\apache-maven-3.9.6\bin\mvn.cmd package
```

---

## API Client üretimi (Frontend)

Frontend tarafında OpenAPI’dan client üretmek için:

Ön koşullar:

- Backend çalışıyor olmalı: `http://localhost:8080/v3/api-docs`
- Java yüklü olmalı (script Java’yı PATH/JAVA_HOME üzerinden arar)

Komut:

```powershell
cd C:\Projects\Framework\Asena\frontend
npm run generate-api
```

Bu script çıktıyı şu klasöre yazar:

- `frontend/libs/shared/src/lib/api`

---

## Sorun giderme

### “JAVA_HOME is not set” / Java bulunamıyor

- JDK 21 kurulu olduğundan emin ol.
- PowerShell’de geçici set etmek için:

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot"
```

### Frontend backend’e bağlanamıyor

- Backend’in 8080’de çalıştığını kontrol et.
- Proxy config: `frontend/apps/web/proxy.conf.json`

### Port çakışması

- 8080 doluysa backend başlamayabilir.
- Frontend servisi farklı bir port seçebilir; terminal çıktısından URL’yi kontrol et.
