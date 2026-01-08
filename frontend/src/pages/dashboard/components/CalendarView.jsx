// import React, { useState, useMemo } from 'react';
// import dayjs from 'dayjs';
// import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // 아이콘
// import './CalendarView.scss'; // 스타일 파일 별도 생성

// function CalendarView({ todoList }) {
//   const [currentDate, setCurrentDate] = useState(dayjs()); // 현재 보고 있는 달

//   // 달 이동 함수
//   const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
//   const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

//   // 달력 생성 로직 (Memoization으로 최적화)
//   const calendarDays = useMemo(() => {
//     const startOfMonth = currentDate.startOf('month');
//     const endOfMonth = currentDate.endOf('month');
//     const startDay = startOfMonth.day(); // 0(일) ~ 6(토)
//     const daysInMonth = currentDate.daysInMonth();

//     const days = [];

//     // 1. 이전 달의 빈 공간 채우기
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }

//     // 2. 현재 달의 날짜 채우기
//     for (let i = 1; i <= daysInMonth; i++) {
//       // 날짜 객체를 생성해서 넣음
//       days.push(currentDate.date(i));
//     }

//     return days;
//   }, [currentDate]);

//   return (
//     <div className="calendar-container">
//       {/* 1. 달력 헤더 (< 1월 >) */}
//       <div className="calendar-header">
//         <button onClick={prevMonth} className="nav-btn"><IoChevronBack /></button>
//         <h2>{currentDate.format('YYYY년 M월')}</h2>
//         <button onClick={nextMonth} className="nav-btn"><IoChevronForward /></button>
//       </div>

//       {/* 2. 요일 헤더 (일 월 화 ...) */}
//       <div className="weekday-header">
//         {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
//           <div key={day} className={`weekday ${day === '일' ? 'sunday' : ''} ${day === '토' ? 'saturday' : ''}`}>
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* 3. 날짜 그리드 */}
//       <div className="calendar-grid">
//         {calendarDays.map((day, index) => {
//           if (!day) return <div key={`empty-${index}`} className="calendar-cell empty"></div>;

//           const dateStr = day.format('YYYY-MM-DD');
          
//           // 해당 날짜에 맞는 투두 필터링
//           const daysTodos = todoList.filter(todo => 
//             dayjs(todo.target_date).format('YYYY-MM-DD') === dateStr
//           );

//           return (
//             <div key={dateStr} className="calendar-cell">
//               <span className={`date-num ${day.day() === 0 ? 'sunday' : ''} ${day.day() === 6 ? 'saturday' : ''}`}>
//                 {day.date()}
//               </span>
              
//               {/* 투두 리스트 출력 (최대 3개 정도만 보여주고 넘치면 +로 표시 추천) */}
//               <div className="cell-todos">
//                 {daysTodos.map(todo => (
//                   <div key={todo.t_idx} className={`mini-todo ${todo.t_state === 'DONE' ? 'done' : ''}`}>
//                     {todo.t_name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default CalendarView;
import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import './CalendarView.scss';
import { useTodoStore } from '../../../store/useTodoStore'; 

function CalendarView({ todoList }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const openInfoModal = useTodoStore((s) => s.openInfoModal);

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDay = startOfMonth.day(); 
    const daysInMonth = currentDate.daysInMonth();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(currentDate.date(i));
    }
    return days;
  }, [currentDate]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn"><IoChevronBack /></button>
        <h2>{currentDate.format('YYYY년 M월')}</h2>
        <button onClick={nextMonth} className="nav-btn"><IoChevronForward /></button>
      </div>

      <div className="weekday-header">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className={`weekday ${day === '일' ? 'sunday' : ''} ${day === '토' ? 'saturday' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="calendar-cell empty"></div>;

          const dateStr = day.format('YYYY-MM-DD');
          
          // 해당 날짜의 모든 일정
          const daysTodos = todoList.filter(todo => 
            dayjs(todo.target_date).format('YYYY-MM-DD') === dateStr
          );

          // ★ 핵심 로직: 최대 3개까지만 자르기
          const MAX_DISPLAY = 3;
          const visibleTodos = daysTodos.slice(0, MAX_DISPLAY);
          const remainingCount = daysTodos.length - MAX_DISPLAY;

          return (
            <div key={dateStr} className="calendar-cell">
              <span className={`date-num ${day.day() === 0 ? 'sunday' : ''} ${day.day() === 6 ? 'saturday' : ''}`}>
                {day.date()}
              </span>
              
              <div className="cell-todos">
                {/* 1. 잘라낸 일정들만 보여줌 */}
                {visibleTodos.map(todo => (
                  <div 
                    key={todo.t_idx} 
                    className={`mini-todo ${todo.t_state === 'DONE' ? 'done' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        openInfoModal(todo.t_idx);
                    }}
                  >
                    {todo.t_name}
                  </div>
                ))}

                {/* 2. 남은 개수가 있으면 +N 표시 */}
                {remainingCount > 0 && (
                  <div className="more-todo-badge">
                    +{remainingCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;