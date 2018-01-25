define({
    DIALOG:{
       TITLE:{
           PRIMARY:"알림",
           DEFAULT:"알림",
           WARNING:"경고",
           INFO:"알림",
           ERROR:"에러",
           USER_ADD:"사용자 등록",
           USER_UPDATE:"사용자 정보 수정",
           DEPARTMENT_ADD:"부서 등록",
           DEPARTMENT_UPDATE:"부서 정보 수정",
           PART_ADD:"파트 등록",
           PART_UPDATE:"파트 정보 수정",
           POSITION_ADD:"직급 등록",
           POSITION_UPDATE:"직급 정보 수정"
       },
       BUTTON:{
           OK:"확인",
           CANCEL:"취소",
           ADD:"등록",
           SAVE:"저장",
           CLOSE:"닫기",
           INIT_PASSWORD:"비밀번호 초기화"
       }
    },
    USER:{
        NAME:"이름",
        LEADER_NAME:"팀장",
        ID:"사번",
        DEPT:"부서",
        PART:"파트",
        NAME_COMMUTE:"식별 이름",
        JOIN_COMPANY:"입사일",
        LEAVE_COMPANY:"퇴사일",
        PRIVILEGE:"결재 권한",
        ADMIN:"관리 권한",
        PASSWORD:"현재 비밀번호",
        NEW_PASSWORD:"새 비밀번호",
        RE_NEW_PASSWORD:"새 비밀번호 확인",
        POSITION:"직급",
        EMAIL:"이메일",
        PHONE:"휴대전화번호",
        APPROVAL_NAME:"결재자",
        IP:"IP",
        OFFICE_IP:"사무실 IP",
        PHONE_OFFICE:"사무실 전화번호",
        BIRTHDAY:"생일",
        WEDDING_DAY:"결혼기념일",
        EMERGENCY_PHONE:"비상연락망",
        MEMO:"메모",
        MAC:"Mac",
        AFFILIATED:"소속"
    },
    
    GRID:{
        MSG:{
            NOT_SELECT_ROW:"선택된 테이터가 없습니다."
        }
    },
    PAGE:{
        TITLE:{
            USER_MANAGER:"사원 관리"
        },
        SUB_TITLE:{
            USER_LIST:"사원 목록"
        }
    },
    
    CODE:{
        PRIVILEGE_1:"결재가능",
        PRIVILEGE_2:"결재불가",
        PRIVILEGE_3:"결재불가",
        ADMIN_0:"사용자",
        ADMIN_1:"부서장",
        ADMIN_2:"임원",
        ADMIN_9:"관리자",
        ALL:"전체",
        LEAVE_USER:"퇴사자",
        WORKER:"근무자",
        POSITION:{
            BOSS:"대표이사",
            VICE_PRESIDENT:"부사장",
            EXECUTIVE_DIRECTOR:"상무이사",
            DIRECTOR:"부장",
            VICE_CHIEF:"차장",
            SECTION__CHIEF:"과장",
            TOP_SEAT:"수석 연구원",
            MIDDLE_SEAT:"책임 연구원",
            SEAT:"선임 연구원",
            DEARI:"대리",
            WORKER:"사원",
            RESEARCHER:"연구원"
        },
        AFFILIATED_0:"본사",
        AFFILIATED_1:"외주"
    },
    //MSG
    SUCCESS:{
        USER:{
            SAVE:"사용자 정보를 수정하였습니다.",
            REMOVE:"사용자를 삭제하였습니다.",
            ADD:"사용자를 등록하였습니다."
        },
        LOGIN:{
            SUCCESS_INIT_PASSWORD:"비밀번호 설정하였습니다.",
            SUCCESS_REQUEST_FIND_PASSWORD:"비밀번호 초기화 요청 메일이 발송되었습니다."
        },
        OFFICEITEM:{
            SAVE:"비품코드를 수정하였습니다.",
            REMOVE:"비품코드를 삭제하였습니다.",
            REMOVE_FAIL:"사용중인 코드입니다.",
            ADD:"비품코드를 등록하였습니다."
        }
    },
    WARNING:{
        LOGIN:{
            NOT_VALID_LOGIN_INFO:"로그인 정보를 입력해주세요.",
            INIT_PASSWORD_PUT:"초기화 정보를 입력해 주세요.",
            DO_NOT_FOUND_USER:"유효하지 않은 사용자 입니다.",
            NOT_EQULES_PASSWORD:"유효하지 않은 비밀번호 입니다.",
            INIT_PASSWORD:"비밀번호를 설정해주세요.",
            FIND_PASSWORD_PUT:"사용자 정보를 입력해 주세요.",
            NOT_VALID_EMAIL:"유효하지 않은 이메일 입니다.",
            ERROR_FIND_PASSWORD_SEND_MAIL:"비밀번호 찾기 실패하였습니다.",
            NOT_EQULES_EMAIL:"유효하지 않은 이메일 입니다."
        },
        USER:{
            NOT_EQULES_CONFIG_PASSWORD:"새 비밀번호가 일치하지않습니다."
        }
    },
    ERROR:{
        AUTH:{
            EXPIRE_AUTH:"세션이 만료 되었습니다."
        },
        HTTP:{
            NOT_FIND_PAGE:"요청한 페이지를 찾을 수 없습니다.",
            SERVER_DIE:"서비스가 다운 되었습니다. 관리자에게 문의해주세요."
        },
        USER_EDIT_VIEW:{
            FAIL_RENDER:"사용자 정보를 받아오지 못하였습니다.",
        }
        
    },
    CONFIRM:{
        USER:{
            REMOVE:"사용자를 삭제 하시겠습니까?"
        },
        OFFICEITEM:{
            REMOVE:"비품코드를 삭제 하시겠습니까?"
        }
    },
    MENU:{
        TOP:{
    		BM:"기초 자료",
            SM:"사원 관리",           
            AM:"근태 관리",
            RM:"회의실",
            IM:"비품 관리"
        },
        SUB:{
        	BM:{
            	POSITION:"직급 관리",
            	DEPARTMENT:"부서 관리",
                PART:"파트 관리",
            	HOLIDAY:"휴일 관리",
            	DOCUMENT:"양식 관리",
            	BOOKDOCUMENT:"도서 관리",
            	ORGANIZATION:"조직도",
        	},
            SM:{
                USER:"사원 관리",
                VACATION:"연차 관리",
                REPORTCOMMUTE: "레포트"
            },
            AM:{
                ADD_RAW_DATA:"출입 기록 등록",
                RAW_DATA_LIST:"출입 기록 조회",
                CREATE_DATA:"근태 자료 생성",
                COMMUTE_MANAGER:"근태 자료 조회",
                COMMUTE_MANAGER_COMMENT:"Comment 관리",
                REPORT_MANAGER:"근태 결재 관리",
                COMMUTE_TODAY:"오늘의 근태상황",
                ALL_REPORT:"근태 일괄 결재"
            },
            RM:{
                ROOM_RESERVE:"회의실 예약",
                GIS:"자리배치도",
            },
            IM:{
        	    USAGE:"비품 할당 현황"
            }
        }
    },
    
    //단위
    UNIT:{
        WON:"원",
        DAY:"일",
        MONTH:"월",
        YEAR:"년",
        HOURE:"시",
        MIN:"분",
        SEC:"초"
    },
    
    //대시보드
    DASHBOARD:{
        WORKING_SUMMARY:{
            ID:"사번",
            NAME:"이름",
            TOTAL_OVERTIEM_PAY:"잔업 수당",
            TOTAL_WORKING_DAY:"총 근무 일수",
            VACATION:"휴가",
            NIGHT_WORKING_A:"야근 A",
            NIGHT_WORKING_B:"야근 B",
            NIGHT_WORKING_C:"야근 C",
            HOLIDAY_WORKING_A:"휴일 근무 A",
            HOLIDAY_WORKING_B:"휴일 근무 B",
            HOLIDAY_WORKING_C:"휴일 근무 C",
            TOTAL_OVER_TIME: "초과 근무 시간",
            TOTAL_HOLIDAY_OVER_TIME: "휴일 근무 시간",
            TOTAL_EARLY_TIME: "조기 출근 시간",
            PERCEPTION:"지각",
            SICK_LEAVE:"조퇴",
            ABSENTEEISM:"결근"
        }    
    },
    COMMENT: {
    	STATE: {
    		ALL : "전체",
    		ACCEPTING : "상신",
    		PROCESSING : "결재",
    		NPROCESSING : "반려",
    		COMPLETE : "처리완료",
    		NACCEPTING : "상신취소",
    	}
    },
    
    TOOLTIP: {
        USER:{
            TYPE:"사용자 유형",
            ADD:"사용자 등록",
            EDIT:"사용자 수정",
            REMOVE:"사용자 삭제"
        }
    },
    
    SUB_TITLE:{
        DETAIL_INFO:"상세 정보",
        REQUIRE_INFO:"주요 정보"
    },
    
    //로그인
    LOGIN_VIEW:{
        TITLE:"YESCNC 근태관리 시스템",
        ID_PLACEHOLDER:"아이디",
        PASSWORD_PLACEHOLDER:"비밀번호",
        LOGIN_SATUS_BTN:"로그인중..",
        LOGIN_BTN:"로그인",
        FIND_PASSWORD_TEXT:"비밀번호를 잊으셨나요?  "
    },
    INIT_PASSWORD_VIEW:{
        TITLE:"비밀번호 설정",
        NEW_PASSWORD_PLACEHOLDER:"새 비밀번호",
        RE_PASSWORD_PLACEHOLDER:"비밀번호 확인",
        INIT_PASSWORD_STATUS_BTN:"비밀번호 저장중..",
        INIT_PASSWORD_BTN:"비밀번호 저장"
    },
     FIND_PASSWORD_VIEW:{
        TITLE:"비밀번호 찾기",
        EMAIL_PLACEHOLDER:"E-mail",
        FIND_PASSWORD_STATUS_BTN:"찾는중..",
        FIND_PASSWORD_BTN:"비밀번호 찾기",
        FIND_TEXT_INFO:"※  아이디와 가입하실때 등록한 이메일를 입력해주세요."
    },
    
    HOLIDAY_MANAGER:{
        TITLE : "휴일 관리",
        SUB_TITLE : "휴일 관리",
        COMBO_LABEL : "연도",
        GRID_COL_NAME : {
            DATE : "날짜",
            MEMO : "내용"
        },
        ADD_DIALOG : {
            TITLE : "휴일 추가",
            TOOLTIP : "추가",
            BUTTON : {
                ADD :"추가",
                CANCEL:"취소"
            },
            MSG : {
                HOLIDAY_ADD_COMPLETE : "휴일이 추가되었습니다.",
                HOLIDAY_ADD_FAIL : "휴일 추가 실패! ㅠㅠ"
            },
            FORM:{
                DATE: "날짜",
                MEMO: "내용",
            },
        },
        REMOVE_DIALOG : {
            TOOLTIP : "삭제",
            MSG : {
                NOTING_SELECTED : "선택된 데이터가 없습니다!",
                HOLIDAY_REMOVE_COMPLETE : "휴일이 삭제되었습니다. ㅠㅠ",
                HOLIDAY_REMOVE_FAIL : "휴일 삭제 실패!"
            }
        },
        
        CREATE_DIALOG : {
            TITLE : "공휴일 생성",
            TOOLTIP : "일괄 생성",
            BUTTON : {
                CREATE :"생성",
                CANCEL :"취소"
            },
            MSG : {
                HOLIDAY_CREATE_COMPLETE : "공휴일 생성이 완료되었습니다.",
                HOLIDAY_CREATE_FAIL : "공휴일 생성 실패!"
            },
            FORM:{
                YEAR: "연도"
            }
        }
        
    },

    
    ADD_RAW_DATA : {
        TITLE : "근태 관리",
        SUB_TITLE:"출입 기록 등록",
        GRID_COL_NAME : {
            DEPARTMENT : "부서",
            NAME : "이름",
            DATE : "날짜",
            TIME : "시간",
            TYPE : "출입기록"
        },
        ADD_DIALOG : {
            TITLE : "출입 기록 파일 등록",
            TOOLTIP : "불러오기",
            BUTTON : {
                ADD : "등록",
                CANCEL : "취소"
            },
            FORM :{
                FILE : "출입 기록 (CSV)"
            },
            MSG : {
                ANALYZE_FAIL : "분석되지 않은 데이터가 있습니다.\n 데이터를 확인하세요",
                ANALYZE_COMPLETE : "파일 분석이 완료 되었습니다.",
                FILE_API_ERR : "해당 브라우저에서 파일 API를 지원하지 않습니다.",
                NOT_SELECT_FILE : "선택된 파일이 없습니다"
                
            }
        },
        COMMIT_DIALOG : {
            MESSAGE : "출입 기록을 서버에 저장하시겠습니까?",
            TOOLTIP : "저장",
            MSG : {
                COMMIT_COMPLET : "데이터 전송이 완료되었습니다.",
                COMMIT_FAIL : "데이터 전송 실패!"
            }
        }
    },
    
    RAW_DATA_LIST : {
        TITLE : "근태 관리",
        SUB_TITLE : "출입 기록 조회",
        SEARCH_BTN : "검색",
        GRID_COL_NAME : {
            DEPARTMENT : "부서",
            NAME : "이름",
            TIME : "출입시간",
            TYPE : "출입기록",
            IP : "IP",
            IP_PC : "사무실 IP",
            NEED_CONFIRM : "확인필요",
            MAC:"Mac"
        },
        MSG :{
            NOK : "확인필요",
            OK : "정상",
            LOADING_FAIL : "데이터 조회 실패!"
        },
        
    },
        
    CREATE_COMMUTE_RESULT : {
        TITLE : "근태 관리",
        SUB_TITLE : "근태 자료 생성",
        GRID_COL_NAME : {
            DATE: "날짜",
            DEPARTMENT: "부서",
            NAME: "이름",
            WORK_TYPE: "근무<br>형태",
            STDIN_TIME: "출근<br>기준",
            IN_TIME: "출근<br>시간",
            LATE_TIME: "지각<br>(분)",
            STDOUT_TIME: "퇴근<br>기준",
            OUT_TIME: "퇴근<br>시간",
            OVER_TIME: "초과근무<br>(분)",
            OVERTIME_CODE: "초과근무",
            VACATION_CODE: "근태",
            OUT_OFFICE_CODE: "외근<br>출장"
        },
        CREATE_DIALOG :{
            TOOLTIP : "근태 생성",
            TITLE : "근태 데이터 생성",
            ASK : "근태 데이터를 생성하시겠습니까?",
            FORM : {
                START_DATE : "시작일",
                END_DATE : "종료일",
                TIP : "참고사항",
                TIP_TEXT : "※ 종료일 다음날 6시 까지 출입 기록 필요\n ex) 종료일이 2015-01-15 일 경우  \n 2015-01-16 06:00 까지 출입기록 필요"
            },
            BUTTON : {
                CREATE : "데이터 생성",
                CANCEL : "취소",
            },
            MSG : {
                CREATE_DATA_COMPLETE : "데이터 생성 완료!",
                CREATE_DATA_FAIL : "데이터 생성 실패!",
                DATE_ERR_MSG : "시작일이 종료일보다 큽니다.",
                DATE_ERR_OTHER_YEAR_MSG : "시작일과 종료일의 연도가 같아야 합니다."
            }
        },
        COMMIT_DIALOG : {
            TOOLTIP : "저장",
            MESSAGE : "근태 데이터를 서버에 저장하시겠습니까?",
            MSG : {
                COMMIT_DATA_COMPLETE : "데이터 전송이 완료되었습니다.",
                COMMIT_DATA_FAIL : "데이터 전송 실패!"
            },
        }
    }, 
    
    COMMUTE_RESULT_LIST : {
        TITLE : "근태 관리",
        SUB_TITLE : "근태 자료 조회",
        SEARCH_BTN : "검색",
        GRID_COL_NAME : {
            DATE: "날짜",
            DEPARTMENT: "부서",
            NAME: "이름",
            WORK_TYPE: "근무<br>타입",
            VACATION: "휴가",
            OUT_OFFICE: "외근<br>정보",
            IN_TIME: "출근<br>시간",
            OUT_TIME: "퇴근<br>시간",
            LATE_TIME: "지각<br>시간",
            OVERTIME_CODE: "초과<br>근무",
            MEMO: "비고"
        },
        MSG : {
            DATE_SELECT_ERROR : "시작일 /종료일을 입력해 주십시오",
            GET_DATA_FAIL : "데이터 조회 실패!",
        },
        UPDATE_DIALOG :{
            TOOLTIP: "수정",
            TITLE : "출퇴근시간 수정",
            BUTTON :{
                MODIFY : "수정",
                CANCEL : "취소",
            },
            FORM :{
                GROUP_DEST: "수정 대상",
                DATE : "날짜",
                DEPARTMENT : "부서",
                NAME : "이름",
                
                GROUP_NEW : "수정 내역",
                IN_TIME:"출근시간",
                OUT_TIME: "퇴근시간",
                OVER_TIME : "초과근무",
                CHANGE_MEMO : "변경 사유"
                
                
            },
            MSG : {
                IN_TIME_MSG : "출근시간",
                OUT_TIME_MSG : "퇴근시간",
                OVER_TIME_MSG : "초과근무",
                OVER_TIME_MSG_MEMO :
                "※ 초과근무를 변경할경우 이후 출퇴근시간 수정, 결재, 결재 취소시에 <br> " 
                +"변경된 초과근무가 반영되지 않습니다.<br>"
                +"수정 사항이 정확합니까?",
                NOTING_SELECTED : "사원을 선택하여 주시기 바랍니다.",
                UPDATE_COMPLETE : "근태 정보가 수정되었습니다.",
                NOTING_CHANGED : "변경된 내용이 없습니다.",
                NOTING_CHANGEDS : "수정 내역 또는 변경 사유가 없습니다."
            }
        },
        COMMENT_DIALOG : {
            TITLE : "COMMENT 등록",
            BUTTON : {
                ADD : "등록",
                CANCEL : "취소",
            },
            FORM : {
                GROUP_DEST : "근태정보",
                DATE : "날짜",
                DEPARTMENT : "부서",
                NAME : "이름",
                
                GROUP_NEW : "수정 요청 사항",
                IN_TIME_BEFORE:"현재 출근시간",
                OUT_TIME_BEFORE: "현재 퇴근시간",
                IN_TIME_AFTER:"수정 요청 시간",
                OUT_TIME_AFTER: "수정 요청 시간",
                COMMENT : "Comment",
            },
            MSG : {

                COMMENT_ADD_COMPLETE : "COMMENT를 등록했습니다.",
                COMMENT_ADD_FAIL : "COMMENT 등록 실패!",
                EMPTY_COMMENT_ERR : "COMMENT에 내용을 입력해주세요",
            },
           
        },
        
        CHANGE_HISTORY_DIALOG : {
            TITLE_IN : "출근 시간 변경 이력",
            TITLE_OUT : "퇴근 시간 변경 이력",
            TITLE_OVER : "초과근무 변경 이력",
            BUTTON : {
                CANCEL : "취소",
            },
        }
    },
    
	COMMUTE_TODAY_LIST : {
        TITLE : "근태 관리",
        SUB_TITLE : "오늘의 근태 상황",
        SEARCH_BTN : "조회",
        GRID_COL_NAME : {
            DATE : "날짜",
            NAME: "이름",
            DEPARTMENT: "부서",
            OUT_OFFICE: "외근/휴가<br>정보",
            START_TIME: "시작<br>시간",
            END_TIME: "종료<br>시간",
            MEMO: "비고"
        }
    },

    ORGANIZATION :{
    	TITLE : "(주)예스씨앤씨  조직도"
    },
    GIS :{
      TITLE : "자리배치도"  
    },
    PART_LIST : {
        TITLE : "파트 관리",
        SEARCH_BTN : "조회",
        GRID_COL_NAME : {
            CODE : "파트코드",
            NAME : "파트",            
            LEADER : "파트장"
        },
        CREATE_DIALOG :{
            TOOLTIP : "파트 등록",
            TITLE : "파트 데이터 생성",
            ASK : "파트 데이터를 생성하시겠습니까?",
            BUTTON : {
                CREATE : "데이터 생성",
                CANCEL : "취소",
            },
            MSG : {
                CREATE_DATA_COMPLETE : "데이터 생성 완료!",
                CREATE_DATA_FAIL : "데이터 생성 실패!"
            },
        },
        UPDATE_DIALOG :{
            TOOLTIP: "수정",
            TITLE : "파트 수정",
            BUTTON :{
                MODIFY : "수정",
                CANCEL : "취소",
            },
        },
        REMOVE_DIALOG : {
            TOOLTIP : "삭제",
            MSG : {
                NOTING_SELECTED : "선택된 데이터가 없습니다!",
                REMOVE :"파트 데이터를 삭제하시겠습니까?",
                REMOVE_COMPLETE : "파트 데이터가 삭제되었습니다.",
                REMOVE_FAIL : "사용중인 파트입니다."
            },
        },    

    },
	DEPARTMENT_LIST : {
        TITLE : "부서 관리",
        SEARCH_BTN : "조회",
        GRID_COL_NAME : {
            CODE : "부서코드",
            NAME : "부서",
            AREA : "지역",
            LEADER : "팀장",
            USE : "사용여부"
        },
        CREATE_DIALOG :{
            TOOLTIP : "부서 등록",
            TITLE : "부서 데이터 생성",
            ASK : "부서 데이터를 생성하시겠습니까?",
            BUTTON : {
                CREATE : "데이터 생성",
                CANCEL : "취소",
            },
            MSG : {
                CREATE_DATA_COMPLETE : "데이터 생성 완료!",
                CREATE_DATA_FAIL : "데이터 생성 실패!"
            },
        },
        UPDATE_DIALOG :{
            TOOLTIP: "수정",
            TITLE : "부서 수정",
            BUTTON :{
                MODIFY : "수정",
                CANCEL : "취소",
            },
            USE_VALUE : {
                USE : '사용',
                NOT_USE : '미사용'
            }
        },
        REMOVE_DIALOG : {
            TOOLTIP : "삭제",
            MSG : {
                NOTING_SELECTED : "선택된 데이터가 없습니다!",
                REMOVE :"부서 데이터를 삭제하시겠습니까?",
                REMOVE_COMPLETE : "부서 데이터가 삭제되었습니다.",
                REMOVE_FAIL : "사용중인 부서입니다."
            },
        },    

    },
    	AREA_LIST : {
    		AREA_1 : "서울",
    		AREA_2 : "수원"    	
    },
    	POSITION_LIST : {
    		TITLE : "직급 관리",
    		SEARCH_BTN : "조회",
    		GRID_COL_NAME : {
            	CODE : "직급코드",
            	NAME : "직급"
        },
        CREATE_DIALOG :{
            TOOLTIP : "직급 등록",
            TITLE : "직급 데이터 생성",
            ASK : "직급 데이터를 생성하시겠습니까?",
            BUTTON : {
                CREATE : "데이터 생성",
                CANCEL : "취소",
            },
            MSG : {
                CREATE_DATA_COMPLETE : "데이터 생성 완료!",
                CREATE_DATA_FAIL : "데이터 생성 실패!"
            },
        },
        UPDATE_DIALOG :{
            TOOLTIP: "수정",
            TITLE : "직급 수정",
            BUTTON :{
                MODIFY : "수정",
                CANCEL : "취소",
            },
        },
        REMOVE_DIALOG : {
            TOOLTIP : "삭제",
            MSG : {
                NOTING_SELECTED : "선택된 데이터가 없습니다!",
                REMOVE :"직급 데이터를 삭제하시겠습니까?",
                REMOVE_COMPLETE : "직급 데이터가 삭제되었습니다.",
                REMOVE_FAIL : "사용중인 직급 데이터입니다."
            },
        },
    },

    OFFICEITEM : {
        TITLE:{
            OFFICEITEM_MANAGER:"비품 관리",   
            TYPE:"비품 유형",
            ADD:"비품 등록",
            EDIT:"비품 수정",
            REMOVE:"비품 삭제",
            SAVE:"비품 정보 저장"         
        },
        SUB_TITLE:{
            OFFICEITEM_LIST:"비품 목록",
            DETAIL_INFO:"비품 상세 정보",
            OFFICEITEM_CODE : "비품코드 관리",
            OFFICEITEM_HISTORY : "비품이력 관리"
        },
        CODE:{
            SERIAL_YES:"관리번호",
            SERIAL_FACTORY:"일련번호",
            VENDOR:"제조사",
            MODEL_NO:"모델명",
            CATEGORY_CODE:"기기 코드",
            CATEGORY_NAME:"기기 종류",
            CATEGORY_TYPE:"기기 분류",
            CATEGORY_INDEX:"기기 INDEX",
            PRICE:"금액",
            SURTAX:"부가세",
            PRICE_BUY:"구입가격",
            BUY_DATE:"구입일",
            DISPOSAL_DATE:"폐기일",
            DISPOSAL_ACCOUNT:"회계상 폐기일",
            EXPIRATION_DATE:"사용 만료일",
            USE_DEPT:"부서 코드",
            USE_USER:"직원 코드",
            USE_DEPT_NAME:"부서",
            USE_USER_NAME:"사용자",
            LOCATION:"장소",
            STATE:"상태",
            MEMO:"메모",
            USE_FLAG:"구분",
        },
        CONFIRM: {
            REMOVE:"비품 정보를 삭제 하시겠습니까?"
        },
        SUCCESS:{
            SAVE:"비품 정보를 수정하였습니다.",
            REMOVE:"비품 정보를 삭제하였습니다.",
            ADD:"비품 정보를 등록하였습니다."
        },
        STATE: {
            NORMAL:"정상",
            BREAK:"고장",
            DISUSE:"폐기",
            STANDBY:"대여"
        },
        USE_STATE: {
            USE:"사용중",
            NOT_USER:"유휴",
        },
        LIST:{
            SEARCH_BTN : "검색",     
            GET_DATA_FAIL : "데이터 조회 실패!",          
        },
        HISTORY : {
            HISTORY_INFO:"이력 정보",  
           
            TITLE: {
                ADD:"이력 등록",
            },
            SUCCESS : {
                ADD:"이력 정보를 등록하였습니다."
            },
            CODE:{
                SEQ : "SEQ",
                SERIAL_YES	:"관리번호",
                CATEGORY_TYPE:"기기 분류",
                HISTORY_DATE:"일자",
                TYPE	    :"발생구분",
                TITLE	    :"내용",
                REPAIR_PRICE:"발생비용",
                USER_ID	    :"사용자 ID",
                USE_DEPT	:"사용 부서",
                NAME	    :"사용",
                CHANGE_USER_ID	:"작업자 이름",
                MEMO	    :"비고",
                CATEGORY_NAME : "기기 종류",
                OWNER : "소유자"
            }
        }, 
        CATEGORY : {
            COLUME : {
                CODE : "관리코드",
                TYPE : "분류",
                NAME : "이름"
            },
            TYPE : {
                OS : "사무",
                CS : "전산"
            },
        },
        MSG :{
            NOK : "확인필요",
            OK : "정상",
            NOTING_SELECTED : "선택된 데이터가 없습니다!",
            LOADING_FAIL : "데이터 조회 실패!"
        },
        ADD_DIALOG :{
            TOOLTIP : "등록",
            TITLE : "비품코드 등록",
            ASK : "비품코드를 등록하시겠습니까?",
            MSG : {
                ADD_CODE_COMPLETE : "비품코드 등록 완료!",
                ADD_CODE_FAIL : "비품코드 등록 실패!"
            }
        },
        EDIT_DIALOG : {
            TOOLTIP : "수정",
            UPDATE:"비품코드 정보 수정",
            MSG : {
                EDIT_CODE_COMPLETE : "비품코드가 수정되었습니다.",
                EDIT_CODE_FAIL : "비품코드 수정 실패!"
            }
        },
        REMOVE_DIALOG : {
            TOOLTIP : "삭제",
            MSG : {
                REMOVE_CODE_COMPLETE : "비품코드가 삭제되었습니다.",
                REMOVE_CODE_FAIL : "비품코드 삭제 실패!"
            }
        }
    },
    IPASSIGNED_MANAGER_LIST : {
        TITLE : "비품 관리",
        SUB_TITLE : "IP 관리",
        SEARCH_BTN : "조회",
        GRID_COL_NAME : {
            IP : "IP",
            USE_DEPT: "사용부서",
            USE_USER: "사용자",
            MEMO: "비고"
        },
    },
    IPCONFIRM:{
        IP:{
            REMOVE:"IP를 삭제 하시겠습니까?",
            REMOVE_COMPLETE:"IP를 삭제 하였습니다.",
            SUCCESS_COMPLETE:"IP를 등록 하였습니다.",
            UPDATE_COMPLETE:"정보를 수정 하였습니다.",
            INVALID_USER:"사용자를 잘못입력하였습니다.",
            INVALID_IP:"IP정보를 잘못입력하였습니다.",
            REGISTER_FAIL:"IP 등록에 실패하였습니다,"
        }
    },
    IPTOOLTIP: {
        IP:{
            TYPE:"IP 유형",
            ADD:"IP 등록",
            EDIT:"IP 수정",
            REMOVE:"IP 삭제"
        }
    },
    USAGE_LIST : {//비품 현황
        TITLE : "비품 관리",
        SUB_TITLE : "비품 할당 현황",
        SEARCH_BTN : "조회",
        GRID_COL_NAME : {
            DEPARTMENT: "부서",
            NAME: "이름",
            DESCTOP: "데스크톱",
            MONITOR: "모니터",
            IP: "IP",
            NOTEBOOK: "노트북",
            DETAIL: "상세",
            CATEGORY_NAME: "장비구분",
            SERIAL: "관리번호",
            MODEL: "모델명",
            BUYDATE: "구입일자"

        },
        MSG :{
            NOK : "확인필요",
            OK : "정상",
            LOADING_FAIL : "데이터 조회 실패!",
            GET_DATA_FAIL : "데이터 조회 실패!"
        },
    }
});