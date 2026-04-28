// Demo Mode - ไม่ต้อง login
var currentProjectId = null;
var DEMO_MODE = true;

        // Login function
        function doLogin() {
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('sroi-system').style.display = 'block';
            document.body.style.overflow = 'auto';
        }
        
        // Go to Dashboard
        function goToDashboard() {
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🎮 Demo Mode - กรุณาเข้าสู่ระบบจริงเพื่อใช้งาน Dashboard', 'info');
                return;
            }
            window.location.href = 'dashboard.html';
        }
        
        // Logout function
        function doLogout() {
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🎮 Demo Mode - คุณไม่ได้ login อยู่', 'info');
                return;
            }
            localStorage.removeItem('sroiUser');
            localStorage.removeItem('sroiToken');
            localStorage.removeItem('sroiLoggedIn');
            localStorage.removeItem('sroiStayLoggedIn');
            window.location.href = 'login.html';
        }

        // ===== Data Storage =====
        let stakeholders = [];
        let changes = [];
        let sroiResult = null;

        // ===== Dropdown Data =====
        const departments = [
            // ฝ่าย
            "ฝ่ายบริหาร",
            "ฝ่ายการศึกษาและดิจิทัล",
            "ฝ่ายการต่างประเทศ",
            "ฝ่ายวิจัยและนวัตกรรม",
            "ฝ่ายกายภาพและสิ่งแวดล้อม",
            "ฝ่ายวิสาหกิจและสังคมยั่งยืน",
            "ฝ่ายศิลปวัฒนธรรมและเศรษฐกิจสร้างสรรค์",
            "ฝ่ายทรัพยากรบุคคล",
            "ฝ่ายกิจการนักศึกษาและนวัตวณิชย์",
            "ฝ่ายกฎหมายและสื่อสารองค์กร",
            // สำนักงานสภามหาวิทยาลัย
            "สำนักงานสภามหาวิทยาลัย",
            // สำนักงานอธิการบดี
            "กองตรวจสอบภายใน",
            "กองกฎหมาย",
            "กองการกีฬา",
            "กองการต่างประเทศ",
            "กองคลัง",
            "กองสาธารณูปโภค และสิ่งแวดล้อม",
            "กองทรัพยากรบุคคล",
            "กองบริการหอพักนักศึกษา",
            "กองบริหารงานกลาง",
            "กองบริหารงานวิจัย",
            "กองป้องกันและรักษาความปลอดภัย",
            "กองพัฒนาคุณภาพการศึกษา",
            "กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์",
            "กองยุทธศาสตร์",
            "กองสื่อสารองค์กร",
            "กองอาคารและสถานที่",
            "สถาบันการสอนวิชาศึกษาทั่วไป",
            "สถาบันขงจื่อ",
            "สถาบันภาษา",
            "สถาบันเคเคยูอะคาเดมี่ (KKU Academy)",
            "สถาบันวิจัยความมั่นคงด้านอาหาร พลังงาน น้ำอนุภูมิภาคลุ่มน้ำโขง",
            "สถาบันวิจัยเพื่อพัฒนาสังคม",
            "สถาบันวิจัยวิจัยมะเร็งท่อน้ำดี",
            "สถาบันวิจัยยุทธศาสตร์และประสานความร่วมมือเพื่อพัฒนาภาคตะวันออกเฉียงเหนือ",
            "สถาบันวิจัยและพัฒนาวิชาชีพครูสำหรับอาเซียน มหาวิทยาลัยขอนแก่น",
            "สถาบันวิจัยวิทยาศาสตร์สุขภาพลุ่มน้ำโขง",
            "สถาบันวิจัยเพื่อพัฒนาสมรรถนะมนุษย์และการสร้างเสริมสุขภาพ",
            "สถาบันวิจัยและบริการออทิซึม",
            "สถาบันวิจัยและนวัตกรรมวัสดุนาโนเพื่อพลังงาน",
            "สถาบันวิจัยแคนนาบิสครบศาสตร์ มหาวิทยาลัยขอนแก่น",
            "ศูนย์ทรัพย์สินทางปัญญา",
            "ศูนย์นวัตกรรมการเรียนการสอน",
            "ศูนย์จริยธรรมการวิจัยในมนุษย์",
            "ศูนย์ประสานงานโครงการอันเนื่องมาจากพระราชดำริ",
            "ศูนย์ศิลปวัฒนธรรม",
            "ศูนย์สัตว์ทดลองภาคตะวันเฉียงเหนือ",
            "ศูนย์อาเซียนศึกษา",
            "ศูนย์พิพิธภัณฑ์และแหล่งเรียนรู้ตลอดชีวิต",
            "ศูนย์บริหารเทคโนโลยีและนวัตกรรม",
            "ศูนย์บริหารเวลเนสและเขตนวัตกรรมทางการแพทย์ มหาวิทยาลัยขอนแก่น",
            "ศูนย์จัดการระบบสารสนเทศเพื่อการบริหารทั่วทั้งองค์กร (ERP)",
            "ศูนย์เคเคยู เอนเตอร์ไพรส์ (KKU Enterprise)",
            "สถาบันฟีโนมแห่งชาติ มหาวิทยาลัยขอนแก่น",
            "ศูนย์กำกับดูแลการดำเนินการต่อสัตว์เพื่องานทางวิทยาศาสตร์ มหาวิทยาลัยขอนแก่น",
            "โรงพิมพ์มหาวิทยาลัยขอนแก่น",
            "ศูนย์บริหารจัดการด้านโรงแรม (บายาสิตา@เคเคยู)",
            "ศูนย์บริการสู่ชุมชน มหาวิทยาลัยขอนแก่น",
            "ศูนย์สื่อการเรียนรู้",
            "อุทยานวิทยาศาสตร์ มหาวิทยาลัยขอนแก่น",
            "โรงงานแบตเตอรี่และพลังงานยุคใหม่",
            "ศูนย์ปลูกและสกัดกัญชง-กัญชามหาวิทยาลัยขอนแก่น",
            "ศูนย์บริหารจัดการทรัพย์สิน มหาวิทยาลัยขอนแก่น",
            "ศูนย์เซลล์บำบัดรักษา มหาวิทยาลัยขอนแก่น",
            // คณะ
            "คณะเกษตรศาสตร์",
            "คณะทันตแพทยศาสตร์",
            "คณะเทคนิคการแพทย์",
            "คณะเทคโนโลยี",
            "คณะนิติศาสตร์",
            "คณะบริหารธุรกิจและการบัญชี",
            "คณะพยาบาลศาสตร์",
            "คณะแพทยศาสตร์",
            "คณะเภสัชศาสตร์",
            "คณะมนุษยศาสตร์และสังคมศาสตร์",
            "คณะวิทยาศาสตร์",
            "คณะวิศวกรรมศาสตร์",
            "คณะศิลปกรรมศาสตร์",
            "คณะศึกษาศาสตร์",
            "คณะเศรษฐศาสตร์",
            "คณะสถาปัตยกรรมศาสตร์",
            "คณะสหวิทยาการ",
            "คณะสัตวแพทยศาสตร์",
            "คณะสาธารณสุขศาสตร์",
            // วิทยาลัย
            "บัณฑิตวิทยาลัย",
            "วิทยาลัยการคอมพิวเตอร์",
            "วิทยาลัยการปกครองท้องถิ่น",
            "วิทยาลัยนานาชาติ",
            "วิทยาลัยบัณฑิตศึกษาการจัดการ",
            // สำนัก
            "สำนักเทคโนโลยีดิจิทัล",
            "สำนักบริการวิชาการ",
            "สำนักบริหารและพัฒนาวิชาการ",
            "สำนักหอสมุด"
        ];

        const strategies = [
            "ยุทธศาสตร์ 1 การปรับเปลี่ยนทางด้านการศึกษา (Education Transformation)",
            "ยุทธศาสตร์ 2 ปรับเปลี่ยนการทำงานวิจัย (Research Transformation)",
            "ยุทธศาสตร์ 3 การนำมหาวิทยาลัยสู่ความเป็นนานาชาติ (Internationalization)",
            "ยุทธศาสตร์ 4 สร้างมหาวิทยาลัยให้เป็นที่น่าทำงาน (Best Place to Work)",
            "ยุทธศาสตร์ 5 สร้างมหาวิทยาลัยให้เป็นที่น่าอยู่ (Great Place to Live)",
            "ยุทธศาสตร์ 6 การบริหารตามหลักธรรมาภิบาลที่ดีและการชี้นำสังคม (Beyond Good Governance)",
            "ยุทธศาสตร์ 7 ปรับเปลี่ยนการบริหารจัดการทรัพยากรบุคคล (Human Resource Management Transformation)",
            "ยุทธศาสตร์ 8 การเป็นมหาวิทยาลัยที่มีสมรรถนะสูง (High Performing University)",
            "ยุทธศาสตร์ 9 การเป็นมหาวิทยาลัยดิจิทัล (Digital University)",
            "ยุทธศาสตร์ 10 การบริการวิชาการเพื่อสร้างประโยชน์ให้สังคม (Societal Contribution)",
            "ยุทธศาสตร์ 11 เสริมสร้างความร่วมมือเพื่อพัฒนา (Collaboration & Coordination for Development)"
        ];

        const sdgList = [
            { id: 1, name: "ขจัดความยากจน" },
            { id: 2, name: "ขจัดความหิวโหย" },
            { id: 3, name: "สุขภาพและความเป็นอยู่ที่ดี" },
            { id: 4, name: "การศึกษาที่มีคุณภาพ" },
            { id: 5, name: "ความเท่าเทียมทางเพศ" },
            { id: 6, name: "น้ำสะอาดและการสุขาภิบาล" },
            { id: 7, name: "พลังงานสะอาดที่เข้าถึงได้" },
            { id: 8, name: "งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ" },
            { id: 9, name: "โครงสร้างพื้นฐาน นวัตกรรม และอุตสาหกรรม" },
            { id: 10, name: "ลดความเหลื่อมล้ำ" },
            { id: 11, name: "เมืองและชุมชนที่ยั่งยืน" },
            { id: 12, name: "การผลิตและบริโภคที่ยั่งยืน" },
            { id: 13, name: "การรับมือกับการเปลี่ยนแปลงสภาพภูมิอากาศ" },
            { id: 14, name: "ทรัพยากรทางทะเล" },
            { id: 15, name: "ระบบนิเวศบนบก" },
            { id: 16, name: "สันติภาพ ความยุติธรรม และสถาบันที่เข้มแข็ง" },
            { id: 17, name: "ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน" }
        ];

        // Outcome Data
        const outcomeEconomic = [
            "การเพิ่มรายได้",
            "การเพิ่มการจ้างงาน",
            "การเพิ่มยอดขายสินค้าและบริการ",
            "การเพิ่มผลผลิตทางการเกษตร",
            "การเพิ่มความสามารถในการเข้าถึงตลาด",
            "การเพิ่มความสามารถในการแข่งขันของธุรกิจ",
            "การลดต้นทุนการผลิต",
            "การส่งเสริมการท่องเที่ยว",
            "การส่งเสริมการลงทุน",
            "การเพิ่มการส่งออกสินค้าและบริการ",
            "การส่งเสริมธุรกิจขนาดกลางและขนาดย่อม (SMEs)",
            "การส่งเสริมผลิตภัณฑ์ OTOP",
            "การเพิ่มการค้าชายแดน",
            "การลดค่าใช้จ่าย",
            "การลดหนี้สิน",
            "การลดความยากจน",
            "การส่งเสริมการออม",
            "การสร้างอาชีพ",
            "การลดอัตราการหยุดงาน",
            "การพัฒนานวัตกรรม",
            "การพัฒนาระบบขนส่งสาธารณะ",
            "การพัฒนาสินค้าและบริการ",
            "การพัฒนาเทคโนโลยีสารสนเทศ",
            "การพัฒนาระบบโลจิสติกส์",
            "การส่งเสริมธุรกิจอีคอมเมิร์ซ",
            "การพัฒนาบรรจุภัณฑ์สินค้า",
            "การพัฒนาตราสัญลักษณ์สินค้า",
            "การส่งเสริมการสร้างแบรนด์",
            "การส่งเสริมผลิตภัณฑ์แฮนด์เมด"
        ];

        const outcomeSocial = [
            "การส่งเสริมภูมิปัญญาท้องถิ่น",
            "การส่งเสริมวัฒนธรรมท้องถิ่น",
            "การเพิ่มการมีส่วนร่วมในการพัฒนาชุมชน",
            "การเพิ่มการมีส่วนร่วมในกิจกรรมชุมชน",
            "การส่งเสริมความเท่าเทียมทางเพศ",
            "การส่งเสริมความหลากหลายทางชาติพันธุ์",
            "การส่งเสริมการร่วมเป็นอาสาสมัคร",
            "การสืบสานและอนุรักษ์ประเพณี",
            "การพัฒนาความสัมพันธ์ในครอบครัว",
            "การสร้างเครือข่ายความร่วมมือ",
            "การเป็นที่รู้จักมากขึ้น/มีภาพลักษณ์ที่ดีในการบริการวิชาการ",
            "การเกิดสุนทรียภาพ",
            "การลดความขัดแย้ง/การต่อต้าน",
            "การลดการเกิดปัญหา/อุปสรรค",
            "การเพิ่มการเข้าถึงการบริการสุขภาพ",
            "การเพิ่มการเข้าถึงการศึกษา",
            "การพัฒนาคุณภาพชีวิต",
            "การส่งเสริมโภชนาการ",
            "การส่งเสริมการออกกำลังกาย",
            "การลดการเจ็บป่วย",
            "การพัฒนาความรู้และทักษะ",
            "การพัฒนาทักษะแรงงาน",
            "การลดการเกิดปัญหาสุขภาพจิต",
            "การลดการเกิดอุบัติเหตุ",
            "การลดการใช้ยาเสพติด",
            "การลดความรุนแรงในสังคม",
            "การลดการเกิดอาชญากรรม",
            "การเพิ่มการเข้าถึงที่อยู่อาศัย"
        ];

        const outcomeEnvironment = [
            "การลดการปล่อยก๊าซเรือนกระจก",
            "การลดการใช้พลาสติก",
            "การเพิ่มการรีไซเคิล",
            "การเพิ่มการใช้พลังงานทดแทน",
            "การลดการใช้กระดาษ",
            "การลดมลพิษทางอากาศ",
            "การเพิ่มพื้นที่สีเขียว",
            "การลดมลพิษทางน้ำ",
            "การลดการใช้สารเคมี",
            "การลดขยะมูลฝอย",
            "การลดการใช้ปุ๋ยเคมี",
            "การลดการเกิดไฟป่า",
            "การลดมลพิษทางเสียง",
            "การเพิ่มการใช้พลังงานหมุนเวียน"
        ];

        function setDefaultDate() {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const yearBE = today.getFullYear() + 543;
            
            // Set default values for custom date pickers
            setDatePickerValue('recordDate', day, month, yearBE);
            setDatePickerValue('startDate', day, month, yearBE);
            setDatePickerValue('endDate', day, month, yearBE);
        }
        
        // ===== Custom Thai Date Picker Functions =====
        function initializeDatePickers() {
            // แปลง input date เป็น custom date picker
            const dateInputs = ['recordDate', 'startDate', 'endDate'];
            dateInputs.forEach(id => {
                createThaiDatePicker(id);
            });
        }
        
        function createThaiDatePicker(inputId) {
            const input = document.getElementById(inputId);
            if (!input) return;
            
            const parent = input.parentNode;
            const currentValue = input.value;
            
            // สร้าง container ใหม่
            const container = document.createElement('div');
            container.className = 'thai-date-picker';
            container.id = inputId + 'Container';
            container.style.cssText = 'display: flex; gap: 8px; align-items: center;';
            
            // Dropdown วัน
            const daySelect = document.createElement('select');
            daySelect.className = 'form-control';
            daySelect.id = inputId + 'Day';
            daySelect.style.cssText = 'flex: 1; min-width: 70px;';
            daySelect.innerHTML = '<option value="">วัน</option>';
            for (let i = 1; i <= 31; i++) {
                daySelect.innerHTML += `<option value="${i}">${i}</option>`;
            }
            
            // Dropdown เดือน
            const monthSelect = document.createElement('select');
            monthSelect.className = 'form-control';
            monthSelect.id = inputId + 'Month';
            monthSelect.style.cssText = 'flex: 2; min-width: 100px;';
            const thaiMonths = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                               'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            monthSelect.innerHTML = '<option value="">เดือน</option>';
            for (let i = 1; i <= 12; i++) {
                monthSelect.innerHTML += `<option value="${i}">${thaiMonths[i]}</option>`;
            }
            
            // Dropdown ปี พ.ศ.
            const yearSelect = document.createElement('select');
            yearSelect.className = 'form-control';
            yearSelect.id = inputId + 'Year';
            yearSelect.style.cssText = 'flex: 1.5; min-width: 90px;';
            const currentYearBE = new Date().getFullYear() + 543;
            yearSelect.innerHTML = '<option value="">ปี พ.ศ.</option>';
            for (let i = currentYearBE + 5; i >= currentYearBE - 20; i--) {
                yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
            }
            
            container.appendChild(daySelect);
            container.appendChild(monthSelect);
            container.appendChild(yearSelect);
            
            // ซ่อน input เดิมและเพิ่ม container ใหม่
            input.type = 'hidden';
            parent.insertBefore(container, input.nextSibling);
            
            // Event listeners เพื่อ sync ค่ากลับไปยัง hidden input
            const syncDate = () => {
                const day = daySelect.value;
                const month = monthSelect.value;
                const yearBE = yearSelect.value;
                if (day && month && yearBE) {
                    const yearCE = parseInt(yearBE) - 543;
                    const dateStr = `${yearCE}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    input.value = dateStr;
                } else {
                    input.value = '';
                }
            };
            
            daySelect.addEventListener('change', syncDate);
            monthSelect.addEventListener('change', syncDate);
            yearSelect.addEventListener('change', syncDate);
            
            // ถ้ามีค่าเดิม ให้แปลงมาแสดง
            if (currentValue) {
                const parts = currentValue.split('-');
                if (parts.length === 3) {
                    const yearBE = parseInt(parts[0]) + 543;
                    const month = parseInt(parts[1]);
                    const day = parseInt(parts[2]);
                    daySelect.value = day;
                    monthSelect.value = month;
                    yearSelect.value = yearBE;
                }
            }
        }
        
        function setDatePickerValue(inputId, day, month, yearBE) {
            const daySelect = document.getElementById(inputId + 'Day');
            const monthSelect = document.getElementById(inputId + 'Month');
            const yearSelect = document.getElementById(inputId + 'Year');
            const hiddenInput = document.getElementById(inputId);
            
            if (daySelect && monthSelect && yearSelect) {
                daySelect.value = day;
                monthSelect.value = month;
                yearSelect.value = yearBE;
                
                // Sync to hidden input
                const yearCE = yearBE - 543;
                hiddenInput.value = `${yearCE}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
        
        function getDatePickerValue(inputId) {
            return document.getElementById(inputId).value;
        }
        
        function loadDateToThaiPicker(inputId, dateValue) {
            if (!dateValue) return;
            
            const parts = dateValue.split('-');
            if (parts.length === 3) {
                const yearCE = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const day = parseInt(parts[2]);
                const yearBE = yearCE + 543;
                
                const daySelect = document.getElementById(inputId + 'Day');
                const monthSelect = document.getElementById(inputId + 'Month');
                const yearSelect = document.getElementById(inputId + 'Year');
                const hiddenInput = document.getElementById(inputId);
                
                if (daySelect && monthSelect && yearSelect) {
                    daySelect.value = day;
                    monthSelect.value = month;
                    yearSelect.value = yearBE;
                }
                
                // ตั้งค่า hidden input ด้วย (ให้แน่ใจว่ามีค่า)
                if (hiddenInput) {
                    hiddenInput.value = dateValue;
                }
            }
        }

        function initializeDropdowns() {
            // Departments - เคลียร์ตัวเลือกเก่าก่อน ยกเว้น default และ other
            const deptSelect = document.getElementById('department');
            const deptOptions = deptSelect.querySelectorAll('option:not([value=""]):not([value="other"])');
            deptOptions.forEach(opt => opt.remove());
            
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                deptSelect.insertBefore(option, deptSelect.lastElementChild);
            });

            // Strategies - เคลียร์ตัวเลือกเก่าก่อน ยกเว้น default และ other
            const stratSelect = document.getElementById('strategy');
            const stratOptions = stratSelect.querySelectorAll('option:not([value=""]):not([value="other"])');
            stratOptions.forEach(opt => opt.remove());
            
            strategies.forEach(strat => {
                const option = document.createElement('option');
                option.value = strat;
                option.textContent = strat;
                stratSelect.insertBefore(option, stratSelect.lastElementChild);
            });
        }

        function initializeSDGs() {
            const container = document.getElementById('sdgContainer');
            // เคลียร์ SDG เก่าก่อน
            container.innerHTML = '';
            
            sdgList.forEach(sdg => {
                const item = document.createElement('label');
                item.className = `sdg-item sdg-${sdg.id}`;
                item.innerHTML = `
                    <input type="checkbox" name="sdg" value="${sdg.id}" onchange="toggleSDGSelection(this)">
                    <span class="sdg-number">${sdg.id}</span>
                    <span class="sdg-label">${sdg.name}</span>
                `;
                container.appendChild(item);
            });
        }

        function toggleSDGSelection(checkbox) {
            checkbox.closest('.sdg-item').classList.toggle('selected', checkbox.checked);
        }

        // ===== Navigation =====
        function showSection(sectionId, btn) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            btn.classList.add('active');
        }

        function showSubTab(tabId, btn) {
            // Hide all sub-contents
            document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabId).classList.add('active');
            btn.classList.add('active');
        }

        // ===== Other Input Toggle =====
        function toggleOtherInput(selectId, containerId) {
            const select = document.getElementById(selectId);
            const container = document.getElementById(containerId);
            
            if (select.value === 'other') {
                container.classList.add('show');
            } else {
                container.classList.remove('show');
            }
        }

        // ===== Update Outcome Options =====
        function updateOutcomeOptions() {
            const category = document.getElementById('outcomeCategory').value;
            const outcomeSelect = document.getElementById('outcomeType');
            
            // Clear existing options
            outcomeSelect.innerHTML = '<option value="">-- เลือก Outcome --</option>';
            
            let outcomes = [];
            if (category === 'เศรษฐกิจ') {
                outcomes = outcomeEconomic;
            } else if (category === 'สังคม') {
                outcomes = outcomeSocial;
            } else if (category === 'สิ่งแวดล้อม') {
                outcomes = outcomeEnvironment;
            }
            
            outcomes.forEach(o => {
                const option = document.createElement('option');
                option.value = o;
                option.textContent = o;
                outcomeSelect.appendChild(option);
            });
            
            // Add "Other" option
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = 'อื่นๆ (ระบุ)';
            outcomeSelect.appendChild(otherOption);
        }

        // ===== Stakeholder Modal =====
        function openStakeholderModal(editIndex = -1) {
            document.getElementById('stakeholderModal').classList.add('show');
            document.getElementById('stakeholderEditIndex').value = editIndex;
            
            if (editIndex >= 0) {
                // Edit mode
                document.getElementById('stakeholderModalTitle').textContent = 'แก้ไข Stakeholder';
                const s = stakeholders[editIndex];
                document.getElementById('stakeholderName').value = s.name;
                
                if (['ผู้รับประโยชน์โดยตรง', 'ผู้ดำเนินงานหลัก', 'หน่วยงานสนับสนุนงบประมาณ', 'กลุ่ม/หน่วยงานที่เกี่ยวข้อง'].includes(s.type)) {
                    document.getElementById('stakeholderType').value = s.type;
                } else {
                    document.getElementById('stakeholderType').value = 'other';
                    document.getElementById('stakeholderTypeOtherValue').value = s.type;
                    document.getElementById('stakeholderTypeOther').classList.add('show');
                }
                
                document.getElementById('stakeholderCount').value = s.count;
                
                // Load unit
                if (['คน', 'ชุมชน', 'หน่วยงาน'].includes(s.unit)) {
                    document.getElementById('stakeholderUnit').value = s.unit;
                } else if (s.unit) {
                    document.getElementById('stakeholderUnit').value = 'other';
                    document.getElementById('stakeholderUnitOtherValue').value = s.unit;
                    document.getElementById('stakeholderUnitOther').classList.add('show');
                }
                
                document.getElementById('stakeholderDetail').value = s.detail;
            } else {
                // Add mode
                document.getElementById('stakeholderModalTitle').textContent = 'เพิ่ม Stakeholder';
                clearStakeholderForm();
            }
        }

        function closeStakeholderModal() {
            document.getElementById('stakeholderModal').classList.remove('show');
            clearStakeholderForm();
        }

        function clearStakeholderForm() {
            document.getElementById('stakeholderName').value = '';
            document.getElementById('stakeholderType').value = '';
            document.getElementById('stakeholderTypeOtherValue').value = '';
            document.getElementById('stakeholderTypeOther').classList.remove('show');
            document.getElementById('stakeholderCount').value = '';
            document.getElementById('stakeholderUnit').value = 'คน';
            document.getElementById('stakeholderUnitOtherValue').value = '';
            document.getElementById('stakeholderUnitOther').classList.remove('show');
            document.getElementById('stakeholderDetail').value = '';
        }

        function saveStakeholder() {
            const name = document.getElementById('stakeholderName').value.trim();
            if (!name) {
                showToast('กรุณากรอกชื่อ Stakeholder', 'error');
                return;
            }
            
            let type = document.getElementById('stakeholderType').value;
            if (type === 'other') {
                type = document.getElementById('stakeholderTypeOtherValue').value.trim();
            }
            
            let unit = document.getElementById('stakeholderUnit').value;
            if (unit === 'other') {
                unit = document.getElementById('stakeholderUnitOtherValue').value.trim() || 'คน';
            }
            
            const stakeholder = {
                name: name,
                type: type || '-',
                count: document.getElementById('stakeholderCount').value || 0,
                unit: unit || 'คน',
                detail: document.getElementById('stakeholderDetail').value.trim() || '-'
            };
            
            const editIndex = parseInt(document.getElementById('stakeholderEditIndex').value);
            if (editIndex >= 0) {
                stakeholders[editIndex] = stakeholder;
            } else {
                stakeholders.push(stakeholder);
            }
            
            renderStakeholderTable();
            closeStakeholderModal();
            updateChangeStakeholderDropdown();
            autoSaveData();
            showToast('บันทึก Stakeholder สำเร็จ', 'success');
        }

        function renderStakeholderTable() {
            const tbody = document.getElementById('stakeholderTable');
            
            if (stakeholders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <i class="fas fa-users"></i>
                                <h3>ยังไม่มีข้อมูล Stakeholder</h3>
                                <p>คลิกปุ่ม "เพิ่ม Stakeholder" เพื่อเริ่มต้น</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = stakeholders.map((s, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td><strong>${s.name}</strong></td>
                    <td><span class="badge badge-primary">${s.type}</span></td>
                    <td>${s.count}</td>
                    <td><span class="badge badge-success">${s.unit || 'คน'}</span></td>
                    <td>${s.detail}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon btn-edit" data-action="edit-stakeholder" data-index="${i}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" data-action="delete-stakeholder" data-index="${i}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function deleteStakeholder(index) {
            if (confirm('ต้องการลบ Stakeholder นี้หรือไม่?')) {
                stakeholders.splice(index, 1);
                renderStakeholderTable();
                updateChangeStakeholderDropdown();
                autoSaveData();
                showToast('ลบ Stakeholder สำเร็จ', 'success');
            }
        }

        // ===== Change Modal =====
        // ===== Dynamic Year Row Functions =====
        function getProjectStartYear() {
            var startDate = document.getElementById('startDate').value;
            if (startDate) {
                var year = parseInt(startDate.split('-')[0]);
                if (year < 2500) year += 543; // แปลง ค.ศ. เป็น พ.ศ.
                return year;
            }
            return new Date().getFullYear() + 543;
        }

        function generateYearOptions(selected) {
            var currentBE = new Date().getFullYear() + 543;
            var startYear = 2500;
            var endYear = 2700;
            var html = '<option value="">-- ปี พ.ศ. --</option>';
            for (var y = startYear; y <= endYear; y++) {
                html += '<option value="' + y + '"' + (y == selected ? ' selected' : '') + '>' + y + '</option>';
            }
            return html;
        }

        function addYearRow(containerId, year, value, type) {
            var container = document.getElementById(containerId);
            var row = document.createElement('div');
            row.className = 'year-row';
            
            var placeholder = type === 'dropoff' ? '0' : '0.00';
            var step = type === 'dropoff' ? '0.1' : '0.01';
            var max = type === 'dropoff' ? ' max="100"' : '';
            var suffix = type === 'dropoff' ? '<span class="year-row-suffix">%</span>' : '';
            
            var inputEvent = '';
            if (type === 'input') inputEvent = ' oninput="updateInputTotal()"';
            
            row.innerHTML = '<select class="form-control year-select" onchange="">' + generateYearOptions(year) + '</select>' +
                '<input type="number" class="form-control year-value" placeholder="' + placeholder + '" min="0"' + max + ' step="' + step + '" value="' + (value || '') + '"' + inputEvent + '>' +
                suffix +
                '<button type="button" class="btn-remove-year" onclick="removeYearRow(this, \'' + type + '\')"><i class="fas fa-times"></i></button>';
            
            container.appendChild(row);
        }

        function removeYearRow(btn, type) {
            btn.closest('.year-row').remove();
            if (type === 'input') updateInputTotal();
        }

        function getYearsData(containerId) {
            var container = document.getElementById(containerId);
            var rows = container.querySelectorAll('.year-row');
            var data = [];
            rows.forEach(function(row) {
                var year = parseInt(row.querySelector('.year-select').value) || 0;
                var value = parseFloat(row.querySelector('.year-value').value) || 0;
                if (year > 0) {
                    data.push({ year: year, value: value });
                }
            });
            return data.sort(function(a, b) { return a.year - b.year; });
        }

        function updateInputTotal() {
            var data = getYearsData('inputYearsContainer');
            var total = data.reduce(function(sum, d) { return sum + d.value; }, 0);
            var el = document.getElementById('inputTotalValue');
            if (el) el.textContent = total.toLocaleString('th-TH', { minimumFractionDigits: 2 });
        }

        function updateAutoCalc() {
            var qty = parseFloat(document.getElementById('outcomeQuantity').value) || 0;
            var proxy = parseFloat(document.getElementById('financialProxyValue').value) || 0;
            var result = qty * proxy;
            
            var unitLabel = document.getElementById('outcomeUnitLabel');
            var unit = unitLabel ? unitLabel.textContent : 'คน';
            
            document.getElementById('calcQuantity').textContent = qty.toLocaleString();
            document.getElementById('calcUnit').textContent = unit;
            document.getElementById('calcProxy').textContent = proxy.toLocaleString();
            document.getElementById('calcResult').textContent = result.toLocaleString('th-TH', { minimumFractionDigits: 2 });
        }

        function updateOutcomeUnitLabel() {
            var stakeholderIdx = document.getElementById('changeStakeholder').value;
            var unitLabel = document.getElementById('outcomeUnitLabel');
            if (stakeholderIdx !== '' && stakeholders[stakeholderIdx]) {
                unitLabel.textContent = stakeholders[stakeholderIdx].unit || 'คน';
            } else {
                unitLabel.textContent = 'คน';
            }
            document.getElementById('calcUnit').textContent = unitLabel.textContent;
        }

        function migrateOldYearData(oldValues, startYear, keys) {
            var years = [];
            keys.forEach(function(key, idx) {
                var val = oldValues[key] || 0;
                if (val > 0) {
                    years.push({ year: startYear + idx, value: val });
                }
            });
            return years;
        }

        function migrateOldDropoff(dropoffArr, startYear) {
            var years = [];
            dropoffArr.forEach(function(rate, idx) {
                if (rate > 0) {
                    years.push({ year: startYear + idx + 1, value: rate });
                }
            });
            return years;
        }

        function loadYearsToContainer(containerId, yearsData, type) {
            var container = document.getElementById(containerId);
            container.innerHTML = '';
            if (yearsData && yearsData.length > 0) {
                yearsData.forEach(function(d) {
                    addYearRow(containerId, d.year, d.value, type);
                });
            }
        }

        function updateChangeStakeholderDropdown(onlyWithChanges) {
            const select = document.getElementById('changeStakeholder');
            select.innerHTML = '<option value="">-- เลือก Stakeholder --</option>';
            
            var stakeholderHasChange = {};
            if (onlyWithChanges) {
                changes.forEach(function(c) {
                    if (c.stakeholderIndex !== undefined && c.stakeholderIndex !== null) {
                        stakeholderHasChange[c.stakeholderIndex] = true;
                    }
                });
            }
            
            stakeholders.forEach((s, i) => {
                if (onlyWithChanges && !stakeholderHasChange[i]) return;
                const option = document.createElement('option');
                option.value = i;
                option.textContent = s.name;
                select.appendChild(option);
            });
            
            if (!document.getElementById('changeStakeholderInfo')) {
                const info = document.createElement('div');
                info.id = 'changeStakeholderInfo';
                info.style.cssText = 'padding: 8px 12px; margin-top: 6px; background: #ebf4ff; border-radius: 8px; font-size: 0.85rem; color: #2c5282; display: none;';
                select.parentNode.appendChild(info);
            }
        }

        function updateChangeStakeholderInfo() {
            var select = document.getElementById('changeStakeholder');
            var info = document.getElementById('changeStakeholderInfo');
            if (!info) return;
            
            var idx = select.value;
            if (idx !== '' && stakeholders[idx]) {
                var s = stakeholders[idx];
                info.textContent = 'จำนวน: ' + (s.count || 0) + ' ' + (s.unit || 'คน');
                info.style.display = 'block';
            } else {
                info.style.display = 'none';
            }
        }

        function onChangeStakeholderChanged() {
            updateChangeStakeholderInfo();
            updateOutcomeUnitLabel();
            
            var stakeholderIdx = document.getElementById('changeStakeholder').value;
            if (stakeholderIdx === '') return;
            
            stakeholderIdx = parseInt(stakeholderIdx);
            var editIndex = parseInt(document.getElementById('changeEditIndex').value);
            
            var foundChange = null;
            
            if (editIndex >= 0 && changes[editIndex] && changes[editIndex].stakeholderIndex === stakeholderIdx) {
                foundChange = changes[editIndex];
            } else {
                for (var i = 0; i < changes.length; i++) {
                    if (i === editIndex) continue;
                    if (changes[i].stakeholderIndex === stakeholderIdx) {
                        foundChange = changes[i];
                        break;
                    }
                }
            }
            
            if (foundChange) {
                var input = foundChange.input || {};
                var startYear = getProjectStartYear();
                document.getElementById('inputDescription').value = input.description || '';
                document.getElementById('inputAdditionalDetails').value = input.additionalDetails || '';
                
                // Load input years
                var inputYears = input.years || [];
                if (inputYears.length === 0 && (input.valueY0 || input.valueY1)) {
                    inputYears = migrateOldYearData(input, startYear, ['valueY0','valueY1','valueY2','valueY3','valueY4','valueY5']);
                }
                loadYearsToContainer('inputYearsContainer', inputYears, 'input');
                updateInputTotal();
                
                var outcome = foundChange.outcome || {};
                
                document.getElementById('outcomeCategoryOther').classList.remove('show');
                document.getElementById('outcomeCategoryOtherValue').value = '';
                document.getElementById('outcomeTypeOther').classList.remove('show');
                document.getElementById('outcomeTypeOtherValue').value = '';
                
                if (['เศรษฐกิจ', 'สังคม', 'สิ่งแวดล้อม'].includes(outcome.category)) {
                    document.getElementById('outcomeCategory').value = outcome.category;
                    updateOutcomeOptions();
                } else if (outcome.category) {
                    document.getElementById('outcomeCategory').value = 'other';
                    document.getElementById('outcomeCategoryOtherValue').value = outcome.category;
                    document.getElementById('outcomeCategoryOther').classList.add('show');
                } else {
                    document.getElementById('outcomeCategory').value = '';
                }
                
                setTimeout(function() {
                    var outcomeSelect = document.getElementById('outcomeType');
                    var found = false;
                    for (var j = 0; j < outcomeSelect.options.length; j++) {
                        if (outcomeSelect.options[j].value === outcome.type) {
                            outcomeSelect.value = outcome.type;
                            found = true;
                            break;
                        }
                    }
                    if (!found && outcome.type) {
                        outcomeSelect.value = 'other';
                        document.getElementById('outcomeTypeOtherValue').value = outcome.type;
                        document.getElementById('outcomeTypeOther').classList.add('show');
                    }
                }, 100);
                
                document.getElementById('indicator').value = outcome.indicator || '';
                document.getElementById('financialProxy').value = outcome.financialProxy || '';
                document.getElementById('financialProxyValue').value = outcome.financialProxyValue || '';
                document.getElementById('outcomeQuantity').value = outcome.quantity || '';
                
                // Load outcome years
                var outcomeYears = outcome.years || [];
                if (outcomeYears.length === 0 && outcome.values) {
                    outcomeYears = migrateOldYearData(outcome.values, startYear, ['Y0','Y1','Y2','Y3','Y4','Y5']);
                }
                loadYearsToContainer('outcomeYearsContainer', outcomeYears, 'outcome');
                updateAutoCalc();
                
                var adjust = foundChange.adjust || {};
                document.getElementById('deadWeight').value = adjust.deadWeight || '';
                document.getElementById('displacement').value = adjust.displacement || '';
                document.getElementById('attribution').value = adjust.attribution || '';
                document.getElementById('discountRate').value = adjust.discountRate || '3.5';
                
                // Load dropoff years
                var dropoffYears = adjust.dropoffYears || [];
                if (dropoffYears.length === 0 && adjust.dropoff && Array.isArray(adjust.dropoff)) {
                    dropoffYears = migrateOldDropoff(adjust.dropoff, startYear);
                }
                loadYearsToContainer('dropoffYearsContainer', dropoffYears, 'dropoff');
            } else {
                document.getElementById('inputDescription').value = '';
                document.getElementById('inputAdditionalDetails').value = '';
                document.getElementById('inputYearsContainer').innerHTML = '';
                updateInputTotal();
                document.getElementById('outcomeCategory').value = '';
                document.getElementById('outcomeCategoryOther').classList.remove('show');
                document.getElementById('outcomeCategoryOtherValue').value = '';
                document.getElementById('outcomeType').innerHTML = '<option value="">-- เลือก Outcome --</option><option value="other">อื่นๆ (ระบุ)</option>';
                document.getElementById('outcomeTypeOther').classList.remove('show');
                document.getElementById('outcomeTypeOtherValue').value = '';
                document.getElementById('indicator').value = '';
                document.getElementById('financialProxy').value = '';
                document.getElementById('financialProxyValue').value = '';
                document.getElementById('outcomeQuantity').value = '';
                document.getElementById('outcomeYearsContainer').innerHTML = '';
                updateAutoCalc();
                document.getElementById('deadWeight').value = '';
                document.getElementById('displacement').value = '';
                document.getElementById('attribution').value = '';
                document.getElementById('discountRate').value = '3.5';
                document.getElementById('dropoffYearsContainer').innerHTML = '';
            }
        }

        function openChangeModal(editIndex = -1) {
            updateChangeStakeholderDropdown(editIndex >= 0);
            document.getElementById('changeModal').classList.add('show');
            document.getElementById('changeEditIndex').value = editIndex;
            
            // Reset to first tab
            showSubTab('inputTab', document.querySelector('.sub-tab'));
            
            if (editIndex >= 0) {
                document.getElementById('changeModalTitle').textContent = 'แก้ไข Change';
                const c = changes[editIndex];
                const input = c.input || {};
                const outcome = c.outcome || {};
                const adjust = c.adjust || {};
                var startYear = getProjectStartYear();
                
                document.getElementById('changeStakeholder').value = (c.stakeholderIndex !== undefined && c.stakeholderIndex !== null) ? c.stakeholderIndex : '';
                updateChangeStakeholderInfo();
                updateOutcomeUnitLabel();
                
                // Input
                document.getElementById('inputDescription').value = input.description || '';
                document.getElementById('inputAdditionalDetails').value = input.additionalDetails || '';
                var inputYears = input.years || [];
                if (inputYears.length === 0 && (input.valueY0 || input.valueY1)) {
                    inputYears = migrateOldYearData(input, startYear, ['valueY0','valueY1','valueY2','valueY3','valueY4','valueY5']);
                }
                loadYearsToContainer('inputYearsContainer', inputYears, 'input');
                updateInputTotal();
                
                // Outcome category/type
                if (['เศรษฐกิจ', 'สังคม', 'สิ่งแวดล้อม'].includes(outcome.category)) {
                    document.getElementById('outcomeCategory').value = outcome.category;
                    updateOutcomeOptions();
                } else if (outcome.category) {
                    document.getElementById('outcomeCategory').value = 'other';
                    document.getElementById('outcomeCategoryOtherValue').value = outcome.category;
                    document.getElementById('outcomeCategoryOther').classList.add('show');
                }
                
                setTimeout(function() {
                    var outcomeSelect = document.getElementById('outcomeType');
                    var found = false;
                    for (var j = 0; j < outcomeSelect.options.length; j++) {
                        if (outcomeSelect.options[j].value === outcome.type) {
                            outcomeSelect.value = outcome.type;
                            found = true;
                            break;
                        }
                    }
                    if (!found && outcome.type) {
                        outcomeSelect.value = 'other';
                        document.getElementById('outcomeTypeOtherValue').value = outcome.type;
                        document.getElementById('outcomeTypeOther').classList.add('show');
                    }
                }, 100);
                
                document.getElementById('indicator').value = outcome.indicator || '';
                document.getElementById('outcomeQuantity').value = outcome.quantity || '';
                document.getElementById('financialProxy').value = outcome.financialProxy || '';
                document.getElementById('financialProxyValue').value = outcome.financialProxyValue || '';
                
                var outcomeYears = outcome.years || [];
                if (outcomeYears.length === 0 && outcome.values) {
                    outcomeYears = migrateOldYearData(outcome.values, startYear, ['Y0','Y1','Y2','Y3','Y4','Y5']);
                }
                loadYearsToContainer('outcomeYearsContainer', outcomeYears, 'outcome');
                updateAutoCalc();
                
                // Adjust
                document.getElementById('deadWeight').value = adjust.deadWeight || '';
                document.getElementById('displacement').value = adjust.displacement || '';
                document.getElementById('attribution').value = adjust.attribution || '';
                document.getElementById('discountRate').value = adjust.discountRate || '3.5';
                
                var dropoffYears = adjust.dropoffYears || [];
                if (dropoffYears.length === 0 && adjust.dropoff && Array.isArray(adjust.dropoff)) {
                    dropoffYears = migrateOldDropoff(adjust.dropoff, startYear);
                }
                loadYearsToContainer('dropoffYearsContainer', dropoffYears, 'dropoff');
            } else {
                document.getElementById('changeModalTitle').textContent = 'เพิ่ม Change';
                clearChangeForm();
            }
        }

        function closeChangeModal() {
            document.getElementById('changeModal').classList.remove('show');
            clearChangeForm();
        }

        function clearChangeForm() {
            document.getElementById('changeStakeholder').value = '';
            updateChangeStakeholderInfo();
            document.getElementById('inputDescription').value = '';
            document.getElementById('inputAdditionalDetails').value = '';
            document.getElementById('inputYearsContainer').innerHTML = '';
            updateInputTotal();
            document.getElementById('outcomeCategory').value = '';
            document.getElementById('outcomeCategoryOther').classList.remove('show');
            document.getElementById('outcomeCategoryOtherValue').value = '';
            document.getElementById('outcomeType').innerHTML = '<option value="">-- เลือก Outcome --</option><option value="other">อื่นๆ (ระบุ)</option>';
            document.getElementById('outcomeTypeOther').classList.remove('show');
            document.getElementById('outcomeTypeOtherValue').value = '';
            document.getElementById('indicator').value = '';
            document.getElementById('outcomeQuantity').value = '';
            document.getElementById('financialProxy').value = '';
            document.getElementById('financialProxyValue').value = '';
            document.getElementById('outcomeYearsContainer').innerHTML = '';
            updateAutoCalc();
            document.getElementById('deadWeight').value = '';
            document.getElementById('displacement').value = '';
            document.getElementById('attribution').value = '';
            document.getElementById('discountRate').value = '3.5';
            document.getElementById('dropoffYearsContainer').innerHTML = '';
        }

        function saveChange() {
            try {
                const stakeholderIndex = document.getElementById('changeStakeholder').value;
                
                if (stakeholderIndex === '') {
                    showToast('กรุณาเลือก Stakeholder', 'error');
                    return;
                }
                
                if (!stakeholders[stakeholderIndex]) {
                    showToast('ไม่พบ Stakeholder ที่เลือก กรุณาเพิ่ม Stakeholder ก่อน', 'error');
                    return;
                }
                
                let outcomeCategory = document.getElementById('outcomeCategory').value;
                if (outcomeCategory === 'other') {
                    outcomeCategory = document.getElementById('outcomeCategoryOtherValue').value.trim();
                }
                
                let outcomeType = document.getElementById('outcomeType').value;
                if (outcomeType === 'other') {
                    outcomeType = document.getElementById('outcomeTypeOtherValue').value.trim();
                }
                
                const change = {
                    stakeholderIndex: parseInt(stakeholderIndex),
                    stakeholderName: stakeholders[stakeholderIndex].name,
                    stakeholderCount: stakeholders[stakeholderIndex].count || 0,
                    stakeholderUnit: stakeholders[stakeholderIndex].unit || 'คน',
                    input: {
                        description: document.getElementById('inputDescription').value.trim(),
                        years: getYearsData('inputYearsContainer'),
                        additionalDetails: document.getElementById('inputAdditionalDetails').value.trim()
                    },
                    outcome: {
                        category: outcomeCategory,
                        type: outcomeType,
                        indicator: document.getElementById('indicator').value.trim(),
                        quantity: parseFloat(document.getElementById('outcomeQuantity').value) || 0,
                        unit: document.getElementById('outcomeUnitLabel').textContent || 'คน',
                        financialProxy: document.getElementById('financialProxy').value.trim(),
                        financialProxyValue: parseFloat(document.getElementById('financialProxyValue').value) || 0,
                        years: getYearsData('outcomeYearsContainer')
                    },
                    adjust: {
                        deadWeight: parseFloat(document.getElementById('deadWeight').value) || 0,
                        displacement: parseFloat(document.getElementById('displacement').value) || 0,
                        attribution: parseFloat(document.getElementById('attribution').value) || 0,
                        discountRate: parseFloat(document.getElementById('discountRate').value) || 3.5,
                        dropoffYears: getYearsData('dropoffYearsContainer')
                    }
                };
                
                const editIndex = parseInt(document.getElementById('changeEditIndex').value);
                if (editIndex >= 0) {
                    changes[editIndex] = change;
                } else {
                    changes.push(change);
                }
                
                renderChangesTable();
                updateOutcomeMapping();
                closeChangeModal();
                showToast('บันทึก Change สำเร็จ', 'success');
                autoSaveData();
                
            } catch (error) {
                console.error('Error in saveChange():', error);
                showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
            }
        }

        function renderChangesTable() {
            const tbody = document.getElementById('changesTable');
            
            if (changes.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="13">
                            <div class="empty-state">
                                <i class="fas fa-exchange-alt"></i>
                                <h3>ยังไม่มีข้อมูล Change</h3>
                                <p>คลิกปุ่ม "เพิ่ม Change" เพื่อเริ่มต้น</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = changes.map((c, i) => {
                const input = c.input || {};
                const outcome = c.outcome || {};
                const adjust = c.adjust || {};
                var startYear = getProjectStartYear();
                
                // Input years
                var inputYears = input.years || [];
                if (inputYears.length === 0 && (input.valueY0 || input.valueY1)) {
                    inputYears = migrateOldYearData(input, startYear, ['valueY0','valueY1','valueY2','valueY3','valueY4','valueY5']);
                }
                var totalInput = inputYears.reduce(function(s, y) { return s + y.value; }, 0);
                var inputDisplay = inputYears.map(function(y) { return y.year + ': ' + formatNumber(y.value); }).join('<br>') || '-';
                
                // Outcome years
                var outcomeYears = outcome.years || [];
                if (outcomeYears.length === 0 && outcome.values) {
                    outcomeYears = migrateOldYearData(outcome.values, startYear, ['Y0','Y1','Y2','Y3','Y4','Y5']);
                }
                var outcomeDisplay = outcomeYears.map(function(y) { return y.year + ': ' + formatNumber(y.value); }).join('<br>') || '-';
                
                // Dropoff years
                var dropoffYears = adjust.dropoffYears || [];
                if (dropoffYears.length === 0 && adjust.dropoff && Array.isArray(adjust.dropoff)) {
                    dropoffYears = migrateOldDropoff(adjust.dropoff, startYear);
                }
                var dropoffDisplay = dropoffYears.map(function(y) { return y.year + ': ' + y.value + '%'; }).join('<br>') || '-';
                
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td><strong>${c.stakeholderName || '-'}</strong></td>
                    <td>${c.stakeholderCount || '-'} ${c.stakeholderUnit || 'คน'}</td>
                    <td>${input.description || '-'}</td>
                    <td style="font-size: 0.8rem;">
                        รวม: ${formatNumber(totalInput)}<br>
                        <small style="color: #718096;">${inputDisplay}</small>
                    </td>
                    <td><span class="badge badge-${getCategoryBadge(outcome.category)}">${outcome.category || '-'}</span></td>
                    <td>${outcome.type || '-'}</td>
                    <td>${outcome.indicator || '-'}</td>
                    <td>${outcome.financialProxy || '-'}</td>
                    <td style="font-size: 0.8rem;">
                        ${outcomeDisplay}
                    </td>
                    <td style="font-size: 0.8rem;">
                        DW: ${adjust.deadWeight || 0}%<br>
                        DP: ${adjust.displacement || 0}%<br>
                        AT: ${adjust.attribution || 0}%<br>
                        DR: ${adjust.discountRate || 3.5}%
                    </td>
                    <td style="font-size: 0.8rem;">
                        ${dropoffDisplay}
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon btn-edit" data-action="edit-change" data-index="${i}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" data-action="delete-change" data-index="${i}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join('');
        }

        function getCategoryBadge(category) {
            if (category === 'เศรษฐกิจ') return 'warning';
            if (category === 'สังคม') return 'primary';
            if (category === 'สิ่งแวดล้อม') return 'success';
            return 'primary';
        }

        function deleteChange(index) {
            if (confirm('ต้องการลบ Change นี้หรือไม่?')) {
                changes.splice(index, 1);
                renderChangesTable();
                updateOutcomeMapping();
                autoSaveData();
                showToast('ลบ Change สำเร็จ', 'success');
            }
        }

        // ===== SROI Calculation =====
        function calculateSROI() {
            if (changes.length === 0) {
                showToast('กรุณาเพิ่มข้อมูล Change อย่างน้อย 1 รายการ', 'error');
                return;
            }
            
            var startYear = getProjectStartYear();
            
            // Total Investment = ผลรวม Input ทุก Change ทุกปี
            var totalInvestment = 0;
            changes.forEach(function(c) {
                var input = c.input || {};
                var years = input.years || [];
                // Migration: ถ้ามีข้อมูลแบบเก่า
                if (years.length === 0 && (input.valueY0 || input.valueY1)) {
                    years = migrateOldYearData(input, startYear, ['valueY0','valueY1','valueY2','valueY3','valueY4','valueY5']);
                }
                years.forEach(function(y) { totalInvestment += y.value; });
            });
            
            if (totalInvestment <= 0) {
                showToast('กรุณากรอกมูลค่า Input อย่างน้อย 1 ปี', 'error');
                return;
            }
            
            // Calculate Present Value for each change
            var totalPresentValue = 0;
            
            changes.forEach(function(c) {
                var adjust = c.adjust || {};
                var outcome = c.outcome || {};
                
                var dw = (adjust.deadWeight || 0) / 100;
                var dp = (adjust.displacement || 0) / 100;
                var at = (adjust.attribution || 0) / 100;
                var dr = (adjust.discountRate || 3.5) / 100;
                
                // Dropoff: year-based or old array
                var dropoffYears = adjust.dropoffYears || [];
                if (dropoffYears.length === 0 && adjust.dropoff && Array.isArray(adjust.dropoff)) {
                    dropoffYears = migrateOldDropoff(adjust.dropoff, startYear);
                }
                
                // Outcome years
                var outcomeYears = outcome.years || [];
                if (outcomeYears.length === 0 && outcome.values) {
                    outcomeYears = migrateOldYearData(outcome.values, startYear, ['Y0','Y1','Y2','Y3','Y4','Y5']);
                }
                
                outcomeYears.forEach(function(oy) {
                    var yearIndex = oy.year - startYear;
                    if (yearIndex < 0) yearIndex = 0;
                    
                    var value = oy.value || 0;
                    
                    // Adjusted Value = Value × (1 - DW) × (1 - DP) × (1 - AT)
                    var adjustedValue = value * (1 - dw) * (1 - dp) * (1 - at);
                    
                    // Apply drop-off cumulatively for years > 0
                    if (yearIndex > 0) {
                        var cumulativeDropoff = 1;
                        dropoffYears.forEach(function(dy) {
                            var dyIndex = dy.year - startYear;
                            if (dyIndex > 0 && dyIndex <= yearIndex) {
                                cumulativeDropoff *= (1 - (dy.value || 0) / 100);
                            }
                        });
                        adjustedValue *= cumulativeDropoff;
                    }
                    
                    // Present Value = Adjusted Value / (1 + DR)^n
                    var presentValue = adjustedValue / Math.pow(1 + dr, yearIndex);
                    totalPresentValue += presentValue;
                });
            });
            
            // SROI Ratio
            var sroiRatio = totalInvestment > 0 ? totalPresentValue / totalInvestment : 0;
            var netBenefit = totalPresentValue - totalInvestment;
            
            // Store result
            sroiResult = {
                sroiRatio: sroiRatio,
                totalPresentValue: totalPresentValue,
                totalInvestment: totalInvestment,
                netBenefit: netBenefit
            };
            
            // Display results
            document.getElementById('sroiRatio').textContent = sroiRatio.toFixed(2);
            document.getElementById('totalPV').textContent = formatNumber(totalPresentValue);
            document.getElementById('totalInvestment').textContent = formatNumber(totalInvestment);
            document.getElementById('netBenefit').textContent = formatNumber(netBenefit);
            
            updateOutcomeMapping();
            updateSummary();
            
            showToast('คำนวณ SROI สำเร็จ', 'success');
        }
        
        // Function to update Outcome Mapping table
        function updateOutcomeMapping() {
            const tbody = document.getElementById('outcomeMappingTable');
            const expectedResults = document.getElementById('expectedResults').value || '-';
            
            if (changes.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state" style="padding: 1rem;">
                                <i class="fas fa-info-circle"></i>
                                <p>ไม่มีข้อมูล Change</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Group by stakeholder
            const stakeholderMap = new Map();
            changes.forEach(c => {
                const key = c.stakeholderIndex;
                if (!stakeholderMap.has(key)) {
                    stakeholderMap.set(key, {
                        name: c.stakeholderName,
                        inputs: [],
                        outcomes: [],
                        activities: []
                    });
                }
                const data = stakeholderMap.get(key);
                if (c.input && c.input.description) {
                    data.inputs.push(c.input.description);
                }
                if (c.outcome && c.outcome.type) {
                    data.outcomes.push(c.outcome.type);
                }
                // Get activity from stakeholder detail
                const stakeholder = stakeholders[c.stakeholderIndex];
                if (stakeholder && stakeholder.detail && stakeholder.detail !== '-' && !data.activities.includes(stakeholder.detail)) {
                    data.activities.push(stakeholder.detail);
                }
            });
            
            let rows = '';
            stakeholderMap.forEach((data, key) => {
                rows += `
                    <tr>
                        <td>${data.inputs.join('<br>') || '-'}</td>
                        <td>${data.activities.join('<br>') || '-'}</td>
                        <td>${expectedResults}</td>
                        <td><strong>${data.name}</strong></td>
                        <td>${data.outcomes.join('<br>') || '-'}</td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = rows;
        }

        function updateSummary() {
            if (!sroiResult) return;
            
            const projectName = document.getElementById('projectName').value || '-';
            const department = getSelectedValue('department', 'departmentOtherValue');
            const recordDate = document.getElementById('recordDate').value;
            const formattedDate = recordDate ? formatThaiDate(recordDate) : '-';
            
            const selectedSDGs = [];
            document.querySelectorAll('input[name="sdg"]:checked').forEach(cb => {
                selectedSDGs.push(cb.value);
            });
            
            document.getElementById('summaryContent').innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    <div class="card" style="margin-bottom: 0;">
                        <h4 style="color: var(--primary); margin-bottom: 1rem;">
                            <i class="fas fa-file-alt"></i> ข้อมูลโครงการ
                        </h4>
                        <p><strong>ชื่อโครงการ:</strong> ${projectName}</p>
                        <p><strong>หน่วยงาน:</strong> ${department || '-'}</p>
                        <p><strong>วันที่ประเมิน:</strong> ${formattedDate}</p>
                        <p><strong>SDGs ที่เกี่ยวข้อง:</strong> ${selectedSDGs.length > 0 ? selectedSDGs.join(', ') : '-'}</p>
                    </div>
                    
                    <div class="card" style="margin-bottom: 0;">
                        <h4 style="color: var(--primary); margin-bottom: 1rem;">
                            <i class="fas fa-chart-pie"></i> ผลการประเมิน SROI
                        </h4>
                        <p><strong>SROI Ratio:</strong> <span style="font-size: 1.5rem; color: var(--accent); font-weight: 700;">${sroiResult.sroiRatio.toFixed(2)}</span></p>
                        <p><strong>Total Present Value:</strong> ${formatNumber(sroiResult.totalPresentValue)} บาท</p>
                        <p><strong>Total Investment:</strong> ${formatNumber(sroiResult.totalInvestment)} บาท</p>
                        <p><strong>Net Benefit:</strong> ${formatNumber(sroiResult.netBenefit)} บาท</p>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 1.5rem;">
                    <h4 style="color: var(--primary); margin-bottom: 1rem;">
                        <i class="fas fa-info-circle"></i> การตีความผล SROI
                    </h4>
                    <p>ค่า SROI = <strong>${sroiResult.sroiRatio.toFixed(2)}</strong> หมายความว่า ทุกๆ 1 บาท ที่ลงทุนในโครงการนี้ สร้างมูลค่าทางสังคมได้ <strong>${sroiResult.sroiRatio.toFixed(2)} บาท</strong></p>
                    ${sroiResult.sroiRatio >= 1 ? 
                        '<p style="color: var(--accent);"><i class="fas fa-check-circle"></i> โครงการนี้สร้างมูลค่าทางสังคมคุ้มค่ากับการลงทุน</p>' : 
                        '<p style="color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> โครงการนี้อาจต้องพิจารณาปรับปรุงเพื่อเพิ่มประสิทธิภาพ</p><p style="color: #718096; font-size: 0.9rem; margin-top: 0.5rem; padding-left: 1.5rem;"><strong>หมายเหตุ:</strong> ทั้งนี้ ขึ้นอยู่กับการพิจารณาของหน่วยงาน ในกรณีที่การประเมินผลออกมาแล้วไม่คุ้มค่าคุ้มทุน</p>'
                    }
                </div>
            `;
        }

        // ===== Certificate Download =====
        function downloadCertificate() {
            // Demo mode - ไม่อนุญาตให้ดาวน์โหลด
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🔒 ต้องเข้าใช้งานเว็บไซต์จริงที่ sroi.kku.ac.th เพื่อดาวน์โหลดใบรับรอง', 'info');
                return;
            }
            
            if (!sroiResult) {
                showToast('กรุณาคำนวณ SROI ก่อน', 'error');
                return;
            }
            
            const projectName = document.getElementById('projectName').value || 'ไม่ระบุชื่อโครงการ';
            const department = getSelectedValue('department', 'departmentOtherValue') || 'ไม่ระบุหน่วยงาน';
            const projectType = getSelectedValue('projectType', 'projectTypeOtherValue') || 'ไม่ระบุรูปแบบ';
            const evaluationType = getSelectedValue('evaluationType', 'evaluationTypeOtherValue') || '';
            const recordDate = document.getElementById('recordDate').value;
            const formattedDate = recordDate ? formatThaiDate(recordDate) : formatThaiDate(new Date().toISOString().split('T')[0]);
            
            const canvas = document.getElementById('certificateCanvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size (A4 aspect ratio)
            canvas.width = 1200;
            canvas.height = 1697;
            
            // Load certificate background image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                // Draw background image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Add text overlay
                ctx.textAlign = 'center';
                
                // รูปแบบการประเมิน (อยู่กึ่งกลางระหว่าง "รับรองการประเมินด้วยตนเอง" กับ "การประเมินผลตอบแทนทางสังคม")
                if (evaluationType) {
                    ctx.font = 'bold 28px Prompt, sans-serif';
                    ctx.fillStyle = '#1a365d';
                    ctx.fillText(`${evaluationType}`, canvas.width / 2, 530);
                }
                
                // Project Type (รูปแบบโครงการ)
                ctx.font = 'bold 28px Prompt, sans-serif';
                ctx.fillStyle = '#1a365d';
                ctx.fillText(`การประเมินผลตอบแทนทางสังคม (SROI)`, canvas.width / 2, 570);
                ctx.fillText(`${projectType}`, canvas.width / 2, 610);
                
                // Project Name - ตัวเล็กลงและไม่มีหัวข้อ
                ctx.font = 'bold 30px Kanit, sans-serif';
                ctx.fillStyle = '#1a365d';
                wrapText(ctx, `${projectName}`, canvas.width / 2, 670, 1000, 40);
                
                // Department - ตัวหนา
                ctx.font = 'bold 28px Prompt, sans-serif';
                ctx.fillStyle = '#4a5568';
                ctx.fillText(`${department}`, canvas.width / 2, 780);
                
                // University - ตัวหนา
                ctx.fillText(`มหาวิทยาลัยขอนแก่น`, canvas.width / 2, 830);
                
                // SROI Result
                ctx.font = 'bold 48px Kanit, sans-serif';
                ctx.fillStyle = '#c9a227';
                ctx.fillText(`SROI = ${sroiResult.sroiRatio.toFixed(2)}`, canvas.width / 2, 900);
                
                // Date (bottom right) - ขยับลงมา 2 บรรทัด
                ctx.textAlign = 'right';
                ctx.font = '22px Prompt, sans-serif';
                ctx.fillStyle = '#4a5568';
                ctx.fillText(`วันที่ประเมิน: ${formattedDate}`, canvas.width - 80, canvas.height - 50);
                
                // Download
                const link = document.createElement('a');
                link.download = `SROI_Certificate_${projectName.replace(/\s+/g, '_')}.jpeg`;
                link.href = canvas.toDataURL('image/jpeg', 0.95);
                link.click();
                
                showToast('ดาวน์โหลด Certificate สำเร็จ', 'success');
            };
            
            img.onerror = function() {
                // If image fails to load, create certificate without background
                createCertificateWithoutBackground(ctx, canvas, projectName, department, projectType, formattedDate, evaluationType);
            };
            
            // Try to load the uploaded certificate image
            img.src = 'images/Certificate_SROI.png';
        }

        // ===== Certificate Download (English Version) =====
        function downloadCertificateEN() {
            // Demo mode - ไม่อนุญาตให้ดาวน์โหลด
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🔒 ต้องเข้าใช้งานเว็บไซต์จริงที่ sroi.kku.ac.th เพื่อดาวน์โหลดใบรับรอง', 'info');
                return;
            }
            
            if (!sroiResult) {
                showToast('Please calculate SROI first', 'error');
                return;
            }
            
            const projectName = document.getElementById('projectName').value || 'Unnamed Project';
            const department = getSelectedValue('department', 'departmentOtherValue') || 'Unspecified Department';
            const projectType = getSelectedValue('projectType', 'projectTypeOtherValue') || 'Unspecified Type';
            const evaluationType = getSelectedValue('evaluationType', 'evaluationTypeOtherValue') || '';
            const recordDate = document.getElementById('recordDate').value;
            const formattedDate = recordDate ? formatEnglishDate(recordDate) : formatEnglishDate(new Date().toISOString().split('T')[0]);
            
            const canvas = document.getElementById('certificateCanvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size (A4 aspect ratio)
            canvas.width = 1200;
            canvas.height = 1697;
            
            // Load certificate background image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                // Draw background image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Add text overlay
                ctx.textAlign = 'center';
                
                // Evaluation Type
                if (evaluationType) {
                    ctx.font = 'bold 28px Prompt, sans-serif';
                    ctx.fillStyle = '#1a365d';
                    ctx.fillText(`${translateEvaluationType(evaluationType)}`, canvas.width / 2, 530);
                }
                
                // Project Type
                ctx.font = 'bold 28px Prompt, sans-serif';
                ctx.fillStyle = '#1a365d';
                ctx.fillText(`Social Return on Investment (SROI) Assessment`, canvas.width / 2, 570);
                ctx.fillText(`${translateProjectType(projectType)}`, canvas.width / 2, 610);
                
                // Project Name
                ctx.font = 'bold 30px Kanit, sans-serif';
                ctx.fillStyle = '#1a365d';
                wrapText(ctx, `${projectName}`, canvas.width / 2, 670, 1000, 40);
                
                // Department
                ctx.font = 'bold 28px Prompt, sans-serif';
                ctx.fillStyle = '#4a5568';
                ctx.fillText(`${department}`, canvas.width / 2, 780);
                
                // University
                ctx.fillText(`Khon Kaen University`, canvas.width / 2, 830);
                
                // SROI Result
                ctx.font = 'bold 48px Kanit, sans-serif';
                ctx.fillStyle = '#c9a227';
                ctx.fillText(`SROI = ${sroiResult.sroiRatio.toFixed(2)}`, canvas.width / 2, 900);
                
                // Date (bottom right)
                ctx.textAlign = 'right';
                ctx.font = '22px Prompt, sans-serif';
                ctx.fillStyle = '#4a5568';
                ctx.fillText(`Assessment Date: ${formattedDate}`, canvas.width - 80, canvas.height - 50);
                
                // Download
                const link = document.createElement('a');
                link.download = `SROI_Certificate_EN_${projectName.replace(/\s+/g, '_')}.jpeg`;
                link.href = canvas.toDataURL('image/jpeg', 0.95);
                link.click();
                
                showToast('Certificate downloaded successfully', 'success');
            };
            
            img.onerror = function() {
                showToast('Failed to load certificate image', 'error');
            };
            
            // Load English certificate template
            img.src = 'images/Certificate_SROI_EN.png';
        }

        // Format date in English
        function formatEnglishDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // Translate evaluation type to English
        function translateEvaluationType(type) {
            const translations = {
                'การประเมินก่อนดำเนินโครงการ (Ex-ante)': 'Ex-ante Evaluation',
                'การประเมินระหว่างดำเนินโครงการ (During)': 'During Project Evaluation',
                'การประเมินหลังสิ้นสุดโครงการ (Ex-post)': 'Ex-post Evaluation'
            };
            return translations[type] || type;
        }

        // Translate project type to English
        function translateProjectType(type) {
            const translations = {
                'โครงการบริการวิชาการ': 'Academic Service Project',
                'โครงการวิจัย': 'Research Project',
                'โครงการทำนุบำรุงศิลปวัฒนธรรม': 'Art and Culture Preservation Project',
                'โครงการพัฒนานักศึกษา': 'Student Development Project',
                'โครงการอื่นๆ': 'Other Project'
            };
            return translations[type] || type;
        }

        function createCertificateWithoutBackground(ctx, canvas, projectName, department, projectType, formattedDate, evaluationType) {
            // Create a nice gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f8f9fa');
            gradient.addColorStop(1, '#e9ecef');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Gold border
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 20;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
            
            // Inner border
            ctx.strokeStyle = '#a73b24';
            ctx.lineWidth = 3;
            ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);
            
            // Corner decorations
            drawCornerDecoration(ctx, 40, 40, 100, 1, 1);
            drawCornerDecoration(ctx, canvas.width - 40, 40, 100, -1, 1);
            drawCornerDecoration(ctx, 40, canvas.height - 40, 100, 1, -1);
            drawCornerDecoration(ctx, canvas.width - 40, canvas.height - 40, 100, -1, -1);
            
            ctx.textAlign = 'center';
            
            // Header
            ctx.font = 'bold 60px Kanit, sans-serif';
            ctx.fillStyle = '#a73b24';
            ctx.fillText('SROI Platform', canvas.width / 2, 200);
            
            ctx.font = 'bold 80px Kanit, sans-serif';
            ctx.fillStyle = '#c9a227';
            ctx.fillText('CERTIFICATE', canvas.width / 2, 320);
            
            ctx.font = '36px Prompt, sans-serif';
            ctx.fillStyle = '#4a5568';
            ctx.fillText('รับรองการประเมินด้วยตัวเอง', canvas.width / 2, 380);
            
            // Divider line
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(200, 420);
            ctx.lineTo(canvas.width - 200, 420);
            ctx.stroke();
            
            // รูปแบบการประเมิน
            if (evaluationType) {
                ctx.font = 'bold 32px Prompt, sans-serif';
                ctx.fillStyle = '#1a365d';
                ctx.fillText(`${evaluationType}`, canvas.width / 2, 500);
            }
            
            // Project Info
            ctx.font = 'bold 32px Prompt, sans-serif';
            ctx.fillStyle = '#1a365d';
            ctx.fillText(`การประเมินผลตอบแทนทางสังคม (SROI)`, canvas.width / 2, 560);
            ctx.fillText(`${projectType}`, canvas.width / 2, 610);
            
            // Project Name
            ctx.font = 'bold 36px Kanit, sans-serif';
            ctx.fillStyle = '#1a365d';
            wrapText(ctx, `${projectName}`, canvas.width / 2, 690, 1000, 45);
            
            // Department
            ctx.font = 'bold 32px Prompt, sans-serif';
            ctx.fillStyle = '#4a5568';
            ctx.fillText(`${department}`, canvas.width / 2, 820);
            ctx.fillText(`มหาวิทยาลัยขอนแก่น`, canvas.width / 2, 870);
            
            // SROI Result Box
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(400, 900, 400, 120);
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 3;
            ctx.strokeRect(400, 900, 400, 120);
            
            ctx.font = 'bold 60px Kanit, sans-serif';
            ctx.fillStyle = '#c9a227';
            ctx.fillText(`SROI = ${sroiResult.sroiRatio.toFixed(2)}`, canvas.width / 2, 980);
            
            // Description
            ctx.font = '24px Prompt, sans-serif';
            ctx.fillStyle = '#4a5568';
            const desc1 = 'รายงานผลการประเมิน SROI ของแผนงานดังกล่าว ประเมินผ่าน SROI Platform';
            const desc2 = 'ภายใต้มหาวิทยาลัยขอนแก่น ครอบคลุมตามกระบวนการปฏิบัติที่เหมาะสม ตามกรอบแนวทาง';
            const desc3 = 'การประเมินผลสัมฤทธิ์สังคมตามหลักการ Social Value Principle ตามหลักมาตรฐานสากล';
            ctx.fillText(desc1, canvas.width / 2, 1100);
            ctx.fillText(desc2, canvas.width / 2, 1140);
            ctx.fillText(desc3, canvas.width / 2, 1180);
            
            // Seal/Badge
            drawSeal(ctx, canvas.width / 2, 1380, 80);
            
            // Date (bottom right) - ขยับลงมา 2 บรรทัด
            ctx.textAlign = 'right';
            ctx.font = '24px Prompt, sans-serif';
            ctx.fillStyle = '#4a5568';
            ctx.fillText(`วันที่ประเมิน: ${formattedDate}`, canvas.width - 100, canvas.height - 70);
            
            // Download
            const link = document.createElement('a');
            link.download = `SROI_Certificate_${projectName.replace(/\s+/g, '_')}.jpeg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
            
            showToast('ดาวน์โหลด Certificate สำเร็จ', 'success');
        }

        function drawCornerDecoration(ctx, x, y, size, dirX, dirY) {
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(x, y + size * dirY);
            ctx.lineTo(x, y);
            ctx.lineTo(x + size * dirX, y);
            ctx.stroke();
        }

        function drawSeal(ctx, x, y, radius) {
            // Outer circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x - 20, y - 20, 0, x, y, radius);
            gradient.addColorStop(0, '#f0d77b');
            gradient.addColorStop(0.5, '#c9a227');
            gradient.addColorStop(1, '#8b6914');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Inner circle
            ctx.beginPath();
            ctx.arc(x, y, radius - 15, 0, Math.PI * 2);
            ctx.fillStyle = '#c9a227';
            ctx.fill();
            
            // Star points
            const points = 16;
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const r = i % 2 === 0 ? radius : radius - 10;
                const angle = (Math.PI * 2 / (points * 2)) * i - Math.PI / 2;
                const px = x + r * Math.cos(angle);
                const py = y + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = '#c9a227';
            ctx.fill();
            
            // Text in seal
            ctx.font = 'bold 20px Kanit, sans-serif';
            ctx.fillStyle = '#a73b24';
            ctx.textAlign = 'center';
            ctx.fillText('KKU', x, y + 8);
        }

        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            let testLine, metrics, testWidth;
            
            for (let n = 0; n < words.length; n++) {
                testLine = line + words[n] + ' ';
                metrics = ctx.measureText(testLine);
                testWidth = metrics.width;
                
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, y);
        }

        // ===== Export to Excel =====
        function exportToExcel() {
            // Demo mode - ไม่อนุญาตให้ส่งออก
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🔒 ต้องเข้าใช้งานเว็บไซต์จริงที่ sroi.kku.ac.th เพื่อส่งออกข้อมูล Excel', 'info');
                return;
            }
            
            if (!sroiResult) {
                showToast('กรุณาคำนวณ SROI ก่อน', 'error');
                return;
            }
            
            const wb = XLSX.utils.book_new();
            
            // Sheet 1: Project Info
            const projectData = [
                ['ข้อมูลโครงการ SROI - มหาวิทยาลัยขอนแก่น'],
                [''],
                ['ชื่อโครงการ', document.getElementById('projectName').value],
                ['วันที่บันทึก', document.getElementById('recordDate').value],
                ['ชื่อผู้บันทึก', document.getElementById('recorderName').value],
                ['งบประมาณ (บาท)', document.getElementById('budget').value],
                ['รูปแบบโครงการ', getSelectedValue('projectType', 'projectTypeOtherValue')],
                ['หน่วยงานที่รับผิดชอบ', getSelectedValue('department', 'departmentOtherValue')],
                ['ยุทธศาสตร์', getSelectedValue('strategy', 'strategyOtherValue')],
                ['รูปแบบการประเมิน', getSelectedValue('evaluationType', 'evaluationTypeOtherValue')],
                ['วัตถุประสงค์', document.getElementById('objectives').value],
                ['ผลที่คาดว่าจะได้รับ', document.getElementById('expectedResults').value],
                ['วันที่เริ่มต้น', document.getElementById('startDate').value],
                ['วันที่สิ้นสุด', document.getElementById('endDate').value],
                ['SDGs ที่เกี่ยวข้อง', getSelectedSDGs().join(', ')]
            ];
            const ws1 = XLSX.utils.aoa_to_sheet(projectData);
            XLSX.utils.book_append_sheet(wb, ws1, 'ข้อมูลโครงการ');
            
            // Sheet 2: Stakeholders
            const stakeholderData = [
                ['Stakeholders (ผู้มีส่วนได้ส่วนเสีย)'],
                [''],
                ['ลำดับ', 'ชื่อ', 'ประเภท', 'จำนวน', 'รายละเอียด'],
                ...stakeholders.map((s, i) => [i + 1, s.name, s.type, s.count, s.detail])
            ];
            const ws2 = XLSX.utils.aoa_to_sheet(stakeholderData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Stakeholders');
            
            // Sheet 3: Changes
            const changesData = [
                ['Changes (การเปลี่ยนแปลง)'],
                [''],
                ['ลำดับ', 'Stakeholder', 'Input', 'มูลค่า Input (Y0)', 'ประเภท Outcome', 'Outcome', 'ตัวชี้วัด', 'Financial Proxy', 'Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Dead Weight (%)', 'Displacement (%)', 'Attribution (%)', 'Discount Rate (%)'],
                ...changes.map((c, i) => [
                    i + 1,
                    c.stakeholderName,
                    c.input.description,
                    c.input.valueY0,
                    c.outcome.category,
                    c.outcome.type,
                    c.outcome.indicator,
                    c.outcome.financialProxy,
                    c.outcome.values.Y0,
                    c.outcome.values.Y1,
                    c.outcome.values.Y2,
                    c.outcome.values.Y3,
                    c.outcome.values.Y4,
                    c.outcome.values.Y5,
                    c.adjust.deadWeight,
                    c.adjust.displacement,
                    c.adjust.attribution,
                    c.adjust.discountRate
                ])
            ];
            const ws3 = XLSX.utils.aoa_to_sheet(changesData);
            XLSX.utils.book_append_sheet(wb, ws3, 'Changes');
            
            // Sheet 4: SROI Results
            const resultsData = [
                ['ผลการคำนวณ SROI'],
                [''],
                ['SROI Ratio', sroiResult.sroiRatio.toFixed(4)],
                ['Total Present Value (บาท)', sroiResult.totalPresentValue.toFixed(2)],
                ['Total Investment (บาท)', sroiResult.totalInvestment.toFixed(2)],
                ['Net Benefit (บาท)', sroiResult.netBenefit.toFixed(2)],
                [''],
                ['การตีความผล'],
                [`ทุกๆ 1 บาท ที่ลงทุนในโครงการนี้ สร้างมูลค่าทางสังคมได้ ${sroiResult.sroiRatio.toFixed(2)} บาท`]
            ];
            const ws4 = XLSX.utils.aoa_to_sheet(resultsData);
            XLSX.utils.book_append_sheet(wb, ws4, 'ผลการคำนวณ');
            
            // Download
            const projectName = document.getElementById('projectName').value || 'SROI';
            XLSX.writeFile(wb, `SROI_Report_${projectName.replace(/\s+/g, '_')}.xlsx`);
            
            showToast('ส่งออกข้อมูล Excel สำเร็จ', 'success');
        }

        // ===== Print Report =====
        function printReport() {
            // Demo mode - ไม่อนุญาตให้พิมพ์
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🔒 ต้องเข้าใช้งานเว็บไซต์จริงที่ sroi.kku.ac.th เพื่อพิมพ์รายงาน', 'info');
                return;
            }
            
            window.print();
        }

        // ===== Utility Functions =====
        function getSelectedValue(selectId, otherInputId) {
            const select = document.getElementById(selectId);
            if (select.value === 'other') {
                return document.getElementById(otherInputId).value;
            }
            return select.value;
        }

        function getSelectedSDGs() {
            const selected = [];
            document.querySelectorAll('input[name="sdg"]:checked').forEach(cb => {
                selected.push(cb.value);
            });
            return selected;
        }

        function formatNumber(num) {
            return new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(num);
        }

        function formatThaiDate(dateStr) {
            const date = new Date(dateStr);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const thaiDate = date.toLocaleDateString('th-TH', options);
            return thaiDate;
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            toast.className = 'toast show ' + type;
            toastMessage.textContent = message;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function resetForm() {
            if (confirm('ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
                document.getElementById('projectName').value = '';
                document.getElementById('projectCode').value = '';
                document.getElementById('recorderName').value = '';
                document.getElementById('budget').value = '';
                document.getElementById('costType').value = '';
                document.getElementById('projectType').value = '';
                document.getElementById('department').value = '';
                document.getElementById('strategy').value = '';
                document.getElementById('evaluationType').value = '';
                document.getElementById('utilization').value = '';
                document.getElementById('objectives').value = '';
                document.getElementById('expectedResults').value = '';
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                
                // Clear other input fields
                document.querySelectorAll('.other-input-container').forEach(c => c.classList.remove('show'));
                document.querySelectorAll('.other-input-container input').forEach(i => i.value = '');
                
                // Clear SDGs
                document.querySelectorAll('input[name="sdg"]').forEach(cb => {
                    cb.checked = false;
                    cb.closest('.sdg-item').classList.remove('selected');
                });
                
                // Clear data
                stakeholders = [];
                changes = [];
                sroiResult = null;
                
                // Re-render tables
                renderStakeholderTable();
                renderChangesTable();
                
                // Clear results
                document.getElementById('sroiRatio').textContent = '-';
                document.getElementById('totalPV').textContent = '-';
                document.getElementById('totalInvestment').textContent = '-';
                document.getElementById('netBenefit').textContent = '-';
                document.getElementById('summaryContent').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>กรุณาคำนวณ SROI ก่อน</h3>
                        <p>ไปที่แท็บ "ผลการคำนวณ" และคลิกปุ่ม "คำนวณ SROI"</p>
                    </div>
                `;
                
                setDefaultDate();
                showToast('ล้างข้อมูลสำเร็จ', 'success');
            }
        }

        // =====================================================
        // API Configuration - เชื่อมต่อ Backend Server
        // =====================================================
        const API_BASE_URL = window.location.origin + '/api';
        
        // ดึง projectId จาก URL parameter (ถ้ามี)
        // currentProjectId ถูกกำหนดไว้แล้วในส่วน <head>
        let currentUserId = 1; // ใช้สำหรับ backward compatibility

        // Auto-save function (ไม่ต้อง validate phoneNumber)
        async function autoSaveData() {
            // Demo mode - ไม่บันทึกลง server
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                console.log('Demo mode - ไม่บันทึกข้อมูล');
                return;
            }
            
            const data = {
                project: {
                    name: document.getElementById('projectName').value,
                    recordDate: document.getElementById('recordDate').value,
                    recorderName: document.getElementById('recorderName').value,
                    budget: document.getElementById('budget').value,
                    projectType: getSelectedValue('projectType', 'projectTypeOtherValue'),
                    department: getSelectedValue('department', 'departmentOtherValue'),
                    strategy: getSelectedValue('strategy', 'strategyOtherValue'),
                    evaluationType: getSelectedValue('evaluationType', 'evaluationTypeOtherValue'),
                    objectives: document.getElementById('objectives').value,
                    expectedResults: document.getElementById('expectedResults').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                    sdgs: getSelectedSDGs(),
                    phoneNumber: document.getElementById('phoneNumber').value || ''
                },
                stakeholders: stakeholders,
                changes: changes,
                sroiResult: sroiResult,
                userId: currentUserId,
                projectId: currentProjectId
            };
            
            try {
                const response = await fetch(API_BASE_URL + '/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // อัพเดท projectId ถ้าเป็นโครงการใหม่
                    if (!currentProjectId && result.projectId) {
                        currentProjectId = result.projectId;
                    }
                    localStorage.setItem('sroiData', JSON.stringify(data));
                    console.log('Auto-save สำเร็จ');
                }
            } catch (error) {
                console.log('Auto-save ล้มเหลว:', error.message);
                localStorage.setItem('sroiData', JSON.stringify(data));
            }
        }

        async function saveData() {
            // Demo mode - ไม่บันทึกลง server
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                showToast('🎮 Demo Mode - ข้อมูลจะไม่ถูกบันทึก แต่คุณสามารถทดลองใช้งานได้', 'info');
                return;
            }
            
            // Validate phone number
            const phoneNumber = document.getElementById('phoneNumber').value;
            if (!phoneNumber || phoneNumber.length < 9) {
                showToast('กรุณากรอกเบอร์โทรติดต่อ (9-10 หลัก)', 'error');
                document.getElementById('phoneNumber').focus();
                return;
            }
            
            const data = {
                project: {
                    name: document.getElementById('projectName').value,
                    recordDate: document.getElementById('recordDate').value,
                    recorderName: document.getElementById('recorderName').value,
                    budget: document.getElementById('budget').value,
                    projectType: getSelectedValue('projectType', 'projectTypeOtherValue'),
                    department: getSelectedValue('department', 'departmentOtherValue'),
                    strategy: getSelectedValue('strategy', 'strategyOtherValue'),
                    evaluationType: getSelectedValue('evaluationType', 'evaluationTypeOtherValue'),
                    objectives: document.getElementById('objectives').value,
                    expectedResults: document.getElementById('expectedResults').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                    sdgs: getSelectedSDGs(),
                    phoneNumber: phoneNumber
                },
                stakeholders: stakeholders,
                changes: changes,
                sroiResult: sroiResult,
                userId: currentUserId,
                projectId: currentProjectId  // เพิ่ม projectId
            };
            
            // Debug: แสดงข้อมูล changes ที่จะบันทึก
            console.log('=== Saving Data ===');
            console.log('Changes to save:', JSON.stringify(changes, null, 2));
            
            try {
                showToast('กำลังบันทึกข้อมูล...', 'info');
                
                const response = await fetch(API_BASE_URL + '/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    const projectId = result.projectId || currentProjectId;
                    
                    // Upload files if any
                    const proposalFile = document.getElementById('proposalFile').files[0];
                    const reportFile = document.getElementById('reportFile').files[0];
                    
                    if (proposalFile || reportFile) {
                        const uploadResult = await uploadFiles(projectId);
                        if (!uploadResult.success) {
                            showToast('บันทึกโครงการสำเร็จ แต่อัปโหลดไฟล์ไม่สำเร็จ', 'warning');
                        }
                    }
                    
                    localStorage.setItem('sroiData', JSON.stringify(data));
                    showToast('บันทึกข้อมูลลง Server สำเร็จ', 'success');
                } else {
                    throw new Error(result.message || 'บันทึกข้อมูลไม่สำเร็จ');
                }
            } catch (error) {
                console.error('Save Error:', error);
                localStorage.setItem('sroiData', JSON.stringify(data));
                showToast('ไม่สามารถเชื่อมต่อ Server ได้ - บันทึกใน Local แทน', 'warning');
            }
        }

        async function loadSavedData() {
            // Demo mode - ไม่โหลดข้อมูลจาก server
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                console.log('Demo mode - ไม่โหลดข้อมูลจาก server');
                return;
            }
            
            // ถ้าไม่มี projectId = โครงการใหม่ ไม่ต้องโหลดข้อมูล
            if (!currentProjectId) {
                console.log('โครงการใหม่ - ไม่มีข้อมูลให้โหลด');
                return;
            }
            
            try {
                // เพิ่ม timestamp เพื่อป้องกัน cache
                const timestamp = new Date().getTime();
                const response = await fetch(API_BASE_URL + '/load?projectId=' + currentProjectId + '&_t=' + timestamp, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                const result = await response.json();
                
                if (result.success && result.data) {
                    applyLoadedData(result.data);
                    console.log('โหลดข้อมูลโครงการ ID:', currentProjectId, 'สำเร็จ');
                    return;
                }
            } catch (error) {
                console.log('ไม่สามารถโหลดจาก Server:', error.message);
            }
            
            // Fallback to localStorage (backward compatibility)
            const savedData = localStorage.getItem('sroiData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    applyLoadedData(data);
                    console.log('โหลดข้อมูลจาก Local Storage');
                } catch (e) {
                    console.error('Error loading saved data:', e);
                }
            }
        }
        
        function applyLoadedData(data) {
            console.log('=== Loading Data ===');
            console.log('Raw data:', JSON.stringify(data, null, 2));
            
            if (data.project) {
                document.getElementById('projectName').value = data.project.name || '';
                document.getElementById('recorderName').value = data.project.recorderName || '';
                document.getElementById('budget').value = data.project.budget || '';
                document.getElementById('objectives').value = data.project.objectives || '';
                document.getElementById('expectedResults').value = data.project.expectedResults || '';
                document.getElementById('phoneNumber').value = data.project.phoneNumber || '';
                
                // โหลดวันที่กลับมาแสดงใน Thai date picker (เฉพาะเมื่อมีค่า)
                // ถ้าไม่มีค่า ให้ใช้ค่า default ที่ตั้งไว้ใน setDefaultDate()
                if (data.project.recordDate) {
                    document.getElementById('recordDate').value = data.project.recordDate;
                    loadDateToThaiPicker('recordDate', data.project.recordDate);
                }
                if (data.project.startDate) {
                    document.getElementById('startDate').value = data.project.startDate;
                    loadDateToThaiPicker('startDate', data.project.startDate);
                }
                if (data.project.endDate) {
                    document.getElementById('endDate').value = data.project.endDate;
                    loadDateToThaiPicker('endDate', data.project.endDate);
                }
                
                // แสดงไฟล์แนบที่มีอยู่
                if (data.project.proposalFile) {
                    document.getElementById('proposalFilePreview').style.display = 'flex';
                    document.getElementById('proposalFileName').textContent = data.project.proposalFile + ' (บันทึกแล้ว)';
                }
                if (data.project.reportFile) {
                    document.getElementById('reportFilePreview').style.display = 'flex';
                    document.getElementById('reportFileName').textContent = data.project.reportFile + ' (บันทึกแล้ว)';
                }
                
                // ===== แก้ไข: Set ค่า Dropdown 4 ตัว =====
                if (data.project.projectType) {
                    setDropdownValue('projectType', 'projectTypeOther', 'projectTypeOtherValue', data.project.projectType);
                }
                if (data.project.department) {
                    setDropdownValue('department', 'departmentOther', 'departmentOtherValue', data.project.department);
                }
                if (data.project.strategy) {
                    setDropdownValue('strategy', 'strategyOther', 'strategyOtherValue', data.project.strategy);
                }
                if (data.project.evaluationType) {
                    setDropdownValue('evaluationType', 'evaluationTypeOther', 'evaluationTypeOtherValue', data.project.evaluationType);
                }
                // ===== สิ้นสุดการแก้ไข =====
                
                if (data.project.sdgs) {
                    data.project.sdgs.forEach(sdgId => {
                        const cb = document.querySelector(`input[name="sdg"][value="${sdgId}"]`);
                        if (cb) {
                            cb.checked = true;
                            cb.closest('.sdg-item').classList.add('selected');
                        }
                    });
                }
            }
            
            stakeholders = data.stakeholders || [];
            
            // ===== แก้ไขปัญหา: ตรวจสอบข้อมูล changes และเพิ่มค่าเริ่มต้นที่ขาดหาย =====
            changes = (data.changes || []).map(change => {
                // ตรวจสอบและเพิ่มโครงสร้างข้อมูลที่ขาดหาย
                if (!change.outcome) {
                    change.outcome = {};
                }
                if (!change.outcome.values) {
                    change.outcome.values = {
                        Y0: 0,
                        Y1: 0,
                        Y2: 0,
                        Y3: 0,
                        Y4: 0,
                        Y5: 0
                    };
                }
                if (!change.adjust) {
                    change.adjust = {};
                }
                if (!change.adjust.dropoff) {
                    change.adjust.dropoff = [0, 0, 0, 0, 0];
                }
                return change;
            });
            
            console.log('Changes after loading:', JSON.stringify(changes, null, 2));
            // ===== สิ้นสุดการแก้ไข =====
            
            sroiResult = data.sroiResult || null;
            
            // Debug: แสดงค่า sroiResult ที่โหลดมา
            console.log('=== Loading SROI Result ===');
            console.log('sroiResult from server:', sroiResult);
            
            renderStakeholderTable();
            renderChangesTable();
            
            // แสดง Outcome Mapping ทันทีเมื่อโหลดข้อมูล (ไม่ต้องกดคำนวณ SROI)
            if (changes.length > 0) {
                updateOutcomeMapping();
            }
            
            // แสดงผล SROI Result ที่บันทึกไว้ (ไม่ต้องกดคำนวณใหม่)
            if (sroiResult && sroiResult.sroiRatio !== undefined && sroiResult.sroiRatio !== null) {
                console.log('✅ Displaying saved SROI Result:', sroiResult.sroiRatio);
                document.getElementById('sroiRatio').textContent = Number(sroiResult.sroiRatio).toFixed(2);
                document.getElementById('totalPV').textContent = formatNumber(sroiResult.totalPresentValue || 0);
                document.getElementById('totalInvestment').textContent = formatNumber(sroiResult.totalInvestment || 0);
                document.getElementById('netBenefit').textContent = formatNumber(sroiResult.netBenefit || 0);
                updateSummary();
            } else {
                console.log('⚠️ No SROI Result found in loaded data');
            }
        }
        
        // ===== ฟังก์ชันใหม่: ตั้งค่า Dropdown =====
        function setDropdownValue(selectId, containerId, inputId, value) {
            const select = document.getElementById(selectId);
            if (!select || !value) return;
            
            // ลองหาค่าใน dropdown options
            let found = false;
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === value) {
                    select.value = value;
                    found = true;
                    break;
                }
            }
            
            // ถ้าไม่พบในตัวเลือก ให้เลือก "other" และใส่ค่าในช่อง input
            if (!found && value !== '') {
                select.value = 'other';
                const container = document.getElementById(containerId);
                const input = document.getElementById(inputId);
                if (container) container.classList.add('show');
                if (input) input.value = value;
            }
        }
        // ===== สิ้นสุดฟังก์ชันใหม่ =====

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Demo mode - แสดงระบบทันทีโดยไม่ต้อง login
            if (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) {
                console.log('🎮 Demo Mode - เริ่มต้นระบบทดลองใช้งาน');
                // แสดง demo banner
                showDemoBanner();
            }
            
            initializeDropdowns();
            initializeSDGs();
            initializeDatePickers();
            setDefaultDate();
            loadSavedData();
            
            // Event delegation: Stakeholder table
            var stakeholderTableEl = document.getElementById('stakeholderTable');
            if (stakeholderTableEl) {
                stakeholderTableEl.addEventListener('click', function(e) {
                    var btn = e.target.closest('button[data-action]');
                    if (!btn) return;
                    var action = btn.getAttribute('data-action');
                    var index = parseInt(btn.getAttribute('data-index'));
                    if (action === 'edit-stakeholder') {
                        openStakeholderModal(index);
                    } else if (action === 'delete-stakeholder') {
                        deleteStakeholder(index);
                    }
                });
            }
            
            // Event delegation: Changes table
            var changesTableEl = document.getElementById('changesTable');
            if (changesTableEl) {
                changesTableEl.addEventListener('click', function(e) {
                    var btn = e.target.closest('button[data-action]');
                    if (!btn) return;
                    var action = btn.getAttribute('data-action');
                    var index = parseInt(btn.getAttribute('data-index'));
                    if (action === 'edit-change') {
                        openChangeModal(index);
                    } else if (action === 'delete-change') {
                        deleteChange(index);
                    }
                });
            }
            
            // Change Stakeholder dropdown
            var changeStakeholderSelect = document.getElementById('changeStakeholder');
            if (changeStakeholderSelect) {
                changeStakeholderSelect.addEventListener('change', onChangeStakeholderChanged);
            }
            
            // Dynamic year buttons
            var btnAddInputYear = document.getElementById('btnAddInputYear');
            if (btnAddInputYear) {
                btnAddInputYear.addEventListener('click', function() {
                    addYearRow('inputYearsContainer', getProjectStartYear(), '', 'input');
                });
            }
            
            var btnAddOutcomeYear = document.getElementById('btnAddOutcomeYear');
            if (btnAddOutcomeYear) {
                btnAddOutcomeYear.addEventListener('click', function() {
                    addYearRow('outcomeYearsContainer', getProjectStartYear(), '', 'outcome');
                });
            }
            
            var btnAddDropoffYear = document.getElementById('btnAddDropoffYear');
            if (btnAddDropoffYear) {
                btnAddDropoffYear.addEventListener('click', function() {
                    addYearRow('dropoffYearsContainer', getProjectStartYear() + 1, '', 'dropoff');
                });
            }
            
            // Auto calc listeners
            var outcomeQuantity = document.getElementById('outcomeQuantity');
            var financialProxyValue = document.getElementById('financialProxyValue');
            if (outcomeQuantity) outcomeQuantity.addEventListener('input', updateAutoCalc);
            if (financialProxyValue) financialProxyValue.addEventListener('input', updateAutoCalc);
        });
        
        // แสดง Demo Banner
        function showDemoBanner() {
            const banner = document.createElement('div');
            banner.id = 'demo-banner';
            banner.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; text-align: center; font-weight: 500; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                    <i class="fas fa-gamepad"></i> โหมดทดลองใช้งาน (Demo Mode) - ข้อมูลจะไม่ถูกบันทึก | 
                    <a href="https://sroi.kku.ac.th" style="color: #ffd700; text-decoration: underline;">เข้าสู่ระบบจริง</a>
                </div>
            `;
            document.body.insertBefore(banner, document.body.firstChild);
            
            // เพิ่ม margin-top ให้ header
            const header = document.querySelector('.header');
            if (header) {
                header.style.marginTop = '48px';
            }
        }

        // ===== LANGUAGE TOGGLE SYSTEM =====
        let currentLanguage = 'th';
        let googleTranslateReady = false;

        function loadGoogleTranslate() {
            var script = document.createElement('script');
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.head.appendChild(script);
        }
        loadGoogleTranslate();

        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'th',
                includedLanguages: 'en',
                autoDisplay: false
            }, 'google_translate_element');
            
            setTimeout(function() {
                googleTranslateReady = true;
            }, 500);
        }

        function toggleLanguage() {
            if (currentLanguage === 'th') {
                if (!googleTranslateReady) {
                    setTimeout(function() {
                        toggleLanguage();
                    }, 500);
                    return;
                }
                var select = document.querySelector('select.goog-te-combo');
                if (select) {
                    select.value = 'en';
                    select.dispatchEvent(new Event('change'));
                    currentLanguage = 'en';
                    updateLangButton();
                }
            } else {
                localStorage.setItem('sroiStayLoggedIn', 'true');
                
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
                
                var gtElems = document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame, .skiptranslate');
                gtElems.forEach(function(el) { el.remove(); });
                
                document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
                
                location.reload(true);
            }
        }

        function updateLangButton() {
            var langText = document.getElementById('langText');
            var langBtn = document.getElementById('langToggleBtn');
            if (currentLanguage === 'en') {
                langText.textContent = 'TH';
                langBtn.title = 'กลับภาษาไทย';
            } else {
                langText.textContent = 'EN';
                langBtn.title = 'Switch to English';
            }
        }

        // ===== File Upload Functions =====
        function validatePDF(input, type) {
            const file = input.files[0];
            if (file) {
                if (file.type !== 'application/pdf') {
                    showToast('กรุณาอัปโหลดไฟล์ PDF เท่านั้น', 'error');
                    input.value = '';
                    return false;
                }
                
                // Show file preview
                const preview = document.getElementById(type + 'FilePreview');
                const fileName = document.getElementById(type + 'FileName');
                preview.style.display = 'flex';
                fileName.textContent = file.name;
                return true;
            }
            return false;
        }

        function removeFile(type) {
            const input = document.getElementById(type + 'File');
            const preview = document.getElementById(type + 'FilePreview');
            input.value = '';
            preview.style.display = 'none';
        }

        // ===== Upload Files Function =====
        async function uploadFiles(projectId) {
            const proposalFile = document.getElementById('proposalFile').files[0];
            const reportFile = document.getElementById('reportFile').files[0];
            
            if (!proposalFile && !reportFile) {
                return { success: true };
            }
            
            const formData = new FormData();
            formData.append('projectId', projectId);
            
            if (proposalFile) {
                formData.append('proposalFile', proposalFile);
            }
            if (reportFile) {
                formData.append('reportFile', reportFile);
            }
            
            try {
                const response = await fetch(API_BASE_URL + '/upload-files', {
                    method: 'POST',
                    body: formData
                });
                return await response.json();
            } catch (error) {
                console.error('Upload error:', error);
                return { success: false, error: error.message };
            }
        }
