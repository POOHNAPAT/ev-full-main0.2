# EV Full Demo
## EV Full Demo (ตัวอย่างโปรเจค)

คุณสมบัติหลักในโปรเจคนี้
- React + Vite (สำหรับการพัฒนาแบบเร็ว)
- แผนที่โดยใช้ Leaflet และ OpenStreetMap tiles
- ตัวอย่างการเชื่อมต่อ Firebase Authentication (email/password) — มีค่าเริ่มต้นเป็นตัวอย่าง ต้องแทนที่ด้วยค่าจริงของคุณ
- UI เบื้องต้น ใช้สไตล์จาก Tailwind (CDN / คลาสในโปรเจกต์)

วิธีการรันโปรเจค (สั้นๆ)

1. แตกไฟล์ (ถ้ายังไม่ได้)
2. เปิดเทอร์มินัลไปที่โฟลเดอร์โปรเจค แล้วติดตั้ง dependency:
```cmd
cd "c:\Users\Acer\New folder (2)\ev-full-main0.2"
npm install
```
3. แก้ไฟล์ `src/firebaseConfig.js` ด้วยค่า Config ของโปรเจกต์ Firebase ของคุณ (ถาจะใช้ฟีเจอร์ Firebase)
4. สตาร์ทเซิร์ฟเวอร์ API (แยกเทอร์มินัล):
```cmd
npm run start:api
```
   - เซิร์ฟเวอร์ API เล็กๆ จะรันที่ `http://localhost:4000` และใช้ในการอ่าน/เขียนไฟล์ JSON ใน `src/data/` สำหรับการพัฒนา
5. สตาร์ท frontend dev server (อีกเทอร์มินัล):
```cmd
npm run dev
```
6. เปิดเบราว์เซอร์ไปที่ URL ที่ Vite แสดง (โดยปกติ `http://localhost:5173` แต่ Vite อาจเลือกพอร์ตอื่นถ้า 5173 ถูกใช้งาน)

คำอธิบายเพิ่มเติมและข้อควรระวัง (Windows)

- หาก PowerShell แจ้งว่า `npm.ps1 cannot be loaded because running scripts is disabled` ให้เรียก `npm` ด้วย `npm.cmd` หรือใช้ `cmd.exe` ตัวอย่าง:
```cmd
cmd /c "npm install"
cmd /c "npm run start:api"
```

- หากพอร์ต `4000` ถูกใช้งานและทำให้ API สตาร์ทไม่ได้ (error `EADDRINUSE`), ตรวจหากระบวนการที่ใช้พอร์ตแล้วปิดมัน (ตัวอย่าง):
```cmd
netstat -ano | findstr ":4000"
tasklist /FI "PID eq <PID_FROM_NETSTAT>"
taskkill /PID <PID_FROM_NETSTAT> /F
```

- หาก API ไม่สามารถเขียนไฟล์ใน `src/data/` ได้ (สิทธิ์ไฟล์) ให้รันเทอร์มินัลด้วยสิทธิ์ที่เพียงพอหรือปรับสิทธิ์ของโฟลเดอร์

การทดสอบอย่างรวดเร็ว (สร้างสถานีทดสอบผ่าน API)

- ใช้ `curl` (ปรับพอร์ต/host ถ้าต่างไป):
```cmd
curl -X POST "http://localhost:4000/api/stations" -H "Content-Type: application/json" -d "{
  \"name\": \"Test Station\",
  \"type\": \"Both\",
  \"location\": \"Test City\",
  \"availablePorts\": 2,
  \"allPorts\": 4,
  \"status\": \"available\",
  \"latitude\": 13.7563,
  \"longitude\": 100.5018,
  \"amenities\": [\"shopping\", \"cafe\"]
}"
```

- มีสคริปต์ช่วยทดสอบด้วย Node อยู่ที่ `server\test-post.js` — รันแบบนี้:
```cmd
node server\test-post.js
```

ผลลัพธ์ที่คาดว่าจะได้
- ถ้าสำเร็จ API จะคืนข้อมูลสถานีที่สร้าง พร้อม `id` และ `stationSerial` (เช่น `ST021`) และข้อมูลจะถูกต่อท้ายในไฟล์ `src/data/stations-data.json`
- ถ้า API ไม่รัน แฟรนต์เอนด์จะทำการแก้ไขแบบ in-memory เท่านั้น (หน้า UI จะเปลี่ยนแต่ไฟล์ JSON ใน `src/data/` จะไม่ถูกเขียน) — โปรแกรมจะแจ้งเตือนด้วย toast บน UI ในกรณี fallback นี้

หมายเหตุเพิ่มเติม
- Leaflet ใช้ OpenStreetMap tiles ดังนั้นไม่ต้องมี API key
- หากต้องการใช้ Firebase Authentication ให้สร้างโปรเจกต์ใน https://console.firebase.google.com แล้วเปิดใช้งาน Sign-in method แบบ Email/Password จากนั้นนำ config ใส่ใน `src/firebaseConfig.js`

หากต้องการให้ผมช่วย:
- แปล README เพิ่มเติมเป็นภาษาไทยแบบสมบูรณ์ (ทำแล้ว)
- ปรับ UI toast ให้สวยขึ้นหรือใช้ไลบรารี (เช่น `react-toastify`) — ต้องการให้ผมเพิ่มไหม?
- ลบไฟล์ทดสอบ `server/test-post.js` หรือเก็บไว้สำหรับ QA

ขอบคุณที่ใช้โปรเจกต์นี้ — แจ้งผมได้เลยว่าต้องการปรับส่วนไหนเพิ่มเติม

### Running the Local API Server (JSON persistence)

This project includes a small local API used in development to persist changes to the JSON files under `src/data/`.

1. Install dependencies (if you haven't already):
```cmd
cd "c:\Users\Acer\New folder (2)\ev-full-main0.2"
npm install
```

2. Start the API server (in a separate terminal). This server listens on port 4000 by default and exposes endpoints like `/api/stations`, `/api/users`, `/api/payments`:
```cmd
npm run start:api
```

3. Start the frontend dev server (in another terminal):
```cmd
npm run dev
```

Notes and troubleshooting (Windows):
- If you see an error in PowerShell like "npm.ps1 cannot be loaded because running scripts is disabled", run `npm` using `npm.cmd` or use `cmd.exe` instead. Example using `cmd.exe`:
```cmd
cmd /c "npm install"
cmd /c "npm run start:api"
```
- If port 4000 is already in use you will get `EADDRINUSE`. Find and stop the process using that port (example in cmd.exe):
```cmd
netstat -ano | findstr ":4000"
tasklist /FI "PID eq <PID_FROM_NETSTAT>"
taskkill /PID <PID_FROM_NETSTAT> /F
```
- If the API server cannot write to `src/data/` because of permission issues, run the terminal with sufficient file permissions or adjust file ACLs for the project folder.

Quick test (create a station via API):
- Using `curl` (replace `localhost`/port if different):
```cmd
curl -X POST "http://localhost:4000/api/stations" -H "Content-Type: application/json" -d "{
   \"name\": \"Test Station\",
   \"type\": \"Both\",
   \"location\": \"Test City\",
   \"availablePorts\": 2,
   \"allPorts\": 4,
   \"status\": \"available\",
   \"latitude\": 13.7563,
   \"longitude\": 100.5018,
   \"amenities\": [\"shopping\", \"cafe\"]
}"
```

- Or use the included helper script (runs with Node):
```cmd
node server\test-post.js
```

If successful, the API will return the created station including an auto-generated `id` and `stationSerial` (e.g. `ST021`) and the object will be appended to `src/data/stations-data.json`.

If the API is not running, the frontend falls back to in-memory changes only (UI will update but `src/data/*.json` will not be written). The app now shows a toast notification when it falls back to local data.
