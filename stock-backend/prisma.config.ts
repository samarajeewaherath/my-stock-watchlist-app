import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // 💡 මෙතන කෙලින්ම URL එක දෙන්න (පරීක්ෂා කිරීමට පමණක්)
    // පසුව අපිට මෙය .env එකට මාරු කළ හැක.
    url: "sqlserver://DESKTOP-JIFH251;database=CSE_DB;integratedSecurity=true;trustServerCertificate=true;"
  },
});