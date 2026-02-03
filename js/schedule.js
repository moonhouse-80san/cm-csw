// 스케줄 관리 전역 변수
let schedules = [
    { id: 1, day: '', startTime: '', endTime: '' },
    { id: 2, day: '', startTime: '', endTime: '' }
];
let nextScheduleId = 3;

// 스케줄 렌더링
function renderSchedules() {
    const container = document.getElementById('schedulesContainer');
    
    if (!container) {
        console.error('❌ schedulesContainer를 찾을 수 없습니다!');
        return;
    }
    
    console.log('🎨 [renderSchedules] 현재 schedules:', JSON.stringify(schedules, null, 2));
    
    container.innerHTML = schedules.map((schedule, index) => `
        <div class="schedule-item" data-schedule-id="${schedule.id}">
            <div class="schedule-section-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span>📅 스케줄 ${index + 1}</span>
                ${schedules.length > 1 ? `
                    <button type="button" class="schedule-delete-btn" onclick="removeSchedule(${schedule.id})" title="삭제">
                        ×
                    </button>
                ` : ''}
            </div>
            <div class="form-grid" style="grid-template-columns: 1fr 2fr; margin-bottom: 10px;">
                <div class="form-group">
                    <label for="day${schedule.id}">요일</label>
                    <select id="day${schedule.id}" data-schedule-id="${schedule.id}" data-field="day">
                        <option value="">요일 선택</option>
                        <option value="월" ${schedule.day === '월' ? 'selected' : ''}>월요일</option>
                        <option value="화" ${schedule.day === '화' ? 'selected' : ''}>화요일</option>
                        <option value="수" ${schedule.day === '수' ? 'selected' : ''}>수요일</option>
                        <option value="목" ${schedule.day === '목' ? 'selected' : ''}>목요일</option>
                        <option value="금" ${schedule.day === '금' ? 'selected' : ''}>금요일</option>
                        <option value="토" ${schedule.day === '토' ? 'selected' : ''}>토요일</option>
                        <option value="일" ${schedule.day === '일' ? 'selected' : ''}>일요일</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>시간</label>
                    <div class="time-group">
                        <input type="time" id="startTime${schedule.id}" 
                               value="${schedule.startTime}" 
                               data-schedule-id="${schedule.id}" 
                               data-field="startTime"
                               step="300">
                        <input type="time" id="endTime${schedule.id}" 
                               value="${schedule.endTime}" 
                               data-schedule-id="${schedule.id}" 
                               data-field="endTime"
                               step="300">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // 이벤트 리스너 추가
    attachScheduleEventListeners();
}

// 스케줄 입력 이벤트 리스너 추가
function attachScheduleEventListeners() {
    // 모든 스케줄 입력 필드에 이벤트 리스너 추가
    const elements = document.querySelectorAll('[data-schedule-id]');
    console.log(`🔗 [attachScheduleEventListeners] ${elements.length}개 요소에 이벤트 리스너 추가`);
    
    elements.forEach(element => {
        if (element.tagName === 'SELECT' || element.tagName === 'INPUT') {
            element.addEventListener('change', updateScheduleData);
        }
    });
}

// 스케줄 데이터 업데이트
function updateScheduleData(event) {
    const scheduleId = parseInt(event.target.dataset.scheduleId);
    const field = event.target.dataset.field;
    const value = event.target.value;
    
    console.log(`📝 [updateScheduleData] ID:${scheduleId}, 필드:${field}, 값:${value}`);
    
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        schedule[field] = value;
        console.log('✅ 스케줄 업데이트 완료:', JSON.stringify(schedule, null, 2));
        console.log('📋 전체 schedules:', JSON.stringify(schedules, null, 2));
    } else {
        console.error('❌ 스케줄을 찾을 수 없습니다. ID:', scheduleId);
    }
}

// 스케줄 추가
function addSchedule() {
    console.log('➕ [addSchedule] 호출됨');
    
    if (schedules.length >= 7) {
        showAlert('최대 7개의 스케줄까지 추가할 수 있습니다!');
        return;
    }
    
    const newSchedule = {
        id: nextScheduleId++,
        day: '',
        startTime: '12:00',
        endTime: '12:20'
    };
    
    schedules.push(newSchedule);
    console.log('✅ 새 스케줄 추가:', newSchedule);
    console.log('📋 현재 schedules:', JSON.stringify(schedules, null, 2));
    
    renderSchedules();
    showAlert(`스케줄 ${schedules.length}이(가) 추가되었습니다!`);
}

// 스케줄 삭제
function removeSchedule(scheduleId) {
    console.log('🗑️ [removeSchedule] ID:', scheduleId);
    
    if (schedules.length <= 1) {
        showAlert('최소 1개의 스케줄은 있어야 합니다!');
        return;
    }
    
    const index = schedules.findIndex(s => s.id === scheduleId);
    if (index !== -1) {
        const removed = schedules.splice(index, 1);
        console.log('✅ 스케줄 삭제됨:', removed);
        renderSchedules();
        showAlert('스케줄이 삭제되었습니다!');
    }
}

// 스케줄 데이터 가져오기 (회원 추가/수정 시 사용)
// IMPORTANT: id 필드를 제외하고 반환 (Firebase 저장용)
function getSchedulesData() {
    console.log('📤 [getSchedulesData] 호출됨');
    console.log('📋 원본 schedules:', JSON.stringify(schedules, null, 2));
    
    const validSchedules = schedules
        .filter(s => {
            const isValid = s.day && s.startTime && s.endTime;
            console.log(`  - ID ${s.id}: day=${s.day}, startTime=${s.startTime}, endTime=${s.endTime} → ${isValid ? '✅ 유효' : '❌ 무효'}`);
            return isValid;
        })
        .map(s => {
            const mapped = {
                day: s.day,
                startTime: s.startTime,
                endTime: s.endTime
            };
            console.log('  → 매핑됨:', mapped);
            return mapped;
        });
    
    console.log('📅 [getSchedulesData] 최종 반환:', JSON.stringify(validSchedules, null, 2));
    
    if (validSchedules.length === 0) {
        console.warn('⚠️ 유효한 스케줄이 없습니다! 모든 스케줄에 요일과 시간이 입력되었는지 확인하세요.');
    }
    
    return validSchedules;
}

// 스케줄 데이터 설정 (회원 편집 시 사용)
function setSchedulesData(memberSchedules) {
    console.log('📥 [setSchedulesData] 호출됨, 입력:', memberSchedules);
    
    if (!memberSchedules || memberSchedules.length === 0) {
        schedules = [
            { id: 1, day: '', startTime: '12:00', endTime: '12:20' },
            { id: 2, day: '', startTime: '12:00', endTime: '12:20' }
        ];
        nextScheduleId = 3;
        console.log('📋 기본 스케줄로 초기화');
    } else {
        schedules = memberSchedules.map((s, index) => ({
            id: index + 1,
            day: s.day || '',
            startTime: s.startTime || '12:00',
            endTime: s.endTime || '12:20'
        }));
        nextScheduleId = schedules.length + 1;
        console.log('✅ 회원 스케줄로 설정됨');
    }
    
    console.log('📋 설정된 schedules:', JSON.stringify(schedules, null, 2));
    renderSchedules();
}

// 스케줄 초기화 (폼 초기화 시 사용)
function resetSchedules() {
    console.log('🔄 [resetSchedules] 호출됨');
    
    schedules = [
        { id: 1, day: '', startTime: '12:00', endTime: '12:20' },
        { id: 2, day: '', startTime: '12:00', endTime: '12:20' }
    ];
    nextScheduleId = 3;
    
    console.log('✅ 스케줄 초기화 완료');
    renderSchedules();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 [DOMContentLoaded] schedule.js 초기화 시작');
    
    const schedulesContainer = document.getElementById('schedulesContainer');
    if (schedulesContainer) {
        console.log('✅ schedulesContainer 발견');
        renderSchedules();
    } else {
        console.warn('⚠️ schedulesContainer를 찾을 수 없습니다. HTML에 id="schedulesContainer"가 있는지 확인하세요.');
    }
});

// 전역 스코프에서 schedules 확인 가능하도록
window.DEBUG_getSchedules = function() {
    console.log('🔍 현재 schedules:', JSON.stringify(schedules, null, 2));
    return schedules;
};

console.log('✅ schedule.js 로드 완료');