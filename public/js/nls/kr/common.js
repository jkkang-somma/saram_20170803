define({
    DIALOG:{
       TITLE:{
           PRIMARY:"알림",
           DEFAULT:"알림",
           WARNING:"경고",
           INFO:"알림",
           ERROR:"에러",
           USER_ADD:"사용자 등록",
           USER_UPDATE:"사용자 정보 수정"
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
        ID:"사번",
        DEPT:"부서",
        NAME_COMMUTE:"식별 이름",
        JOIN_COMPANY:"입사일",
        LEAVE_COMPANY:"퇴사일",
        PRIVILEGE:"결재 권한",
        ADMIN:"관리 권한",
        PASSWORD:"비밀번호",
        NEW_PASSWORD:"New 비밀번호",
        RE_NEW_PASSWORD:"확인 New 비밀번호",
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
        MEMO:"메모"
    },
    
    GRID:{
        MSG:{
            NOT_SELECT_ROW:"선택된 테이터가 없습니다."
        }
    },
    PAGE:{
        TITLE:{
            USER_MANAGER:"사용자 관리"
        },
        SUB_TITLE:{
            USER_LIST:"사용자 목록"
        }
    },
    
    CODE:{
        PRIVILEGE_1:"결재가능",
        PRIVILEGE_2:"결재불가",
        PRIVILEGE_3:"결재불가",
        ADMIN_0:"사용자",
        ADMIN_1:"관리자",
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
        }
    },
    //MSG
    SUCCESS:{
        USER:{
            SAVE:"사용자 정보를 수정하였습니다.",
            REMOVE:"사용자를 삭제하였습니다.",
            ADD:"사용자를 등록하였습니다."
        },
        LOGIN:{
            SUCCESS_INIT_PASSWORD:"비밀번호 설정하였습니다."
        }
    },
    WARNING:{
        LOGIN:{
            NOT_VALID_LOGIN_INFO:"로그인 정보를 입력해주세요.",
            INIT_PASSWORD_PUT:"초기화 정보를 입력해 주세요.",
            DO_NOT_FOUND_USER:"유효하지 않은 사용자 입니다.",
            NOT_EQULES_PASSWORD:"유효하지 않은 비밀번호 입니다.",
            INIT_PASSWORD:"비밀번호를 설정해주세요.",
            FIND_PASSWORD_PUT:"사용자 정보를 입력해 주세요."
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
        }
    },
    MENU:{
        TOP:{
            SM:"일반 관리",
            AM:"근태 관리"
        },
        SUB:{
            SM:{
                USER:"사원 관리",
                HOLIDAY:"휴일 관리",
                VACATION:"연차 관리",
                REPORTCOMMUTE: "레포트"
            },
            AM:{
                ADD_RAW_DATA:"출입 기록 등록",
                RAW_DATA_LIST:"출입 기록 조회",
                CREATE_DATA:"근태 자료 생성",
                COMMUTE_MANAGER:"근태 자료 조회",
                COMMUTE_MANAGER_COMMENT:"근태 Comment 내역 관리",
                REPORT_MANAGER:"근태 결재 관리"
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
            PERCEPTION:"지각",
            SICK_LEAVE:"조퇴",
            ABSENTEEISM:"결근"
        }    
    },
    COMMENT: {
    	STATE: {
    		ALL : "전체",
    		ACCEPTING : "접수중",
    		PROCESSING : "처리중",
    		COMPLETE : "처리완료"
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
        TITLE:"Yescnc 근태관리 시스템",
        ID_PLACEHOLDER:"아이디",
        PASSWORD_PLACEHOLDER:"비밀번호",
        LOGIN_SATUS_BTN:"로그인중..",
        LOGIN_BTN:"로그인",
        FIND_PASSWORD_TEXT:"비밀번호를 잊으셨나요?  ",
        FIND_PASSWORD_TEXT_A:"비밀번호 찾기"
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
        ADD:{
            DATE: "날짜",
            MEMO: "내용",
        },
        CREATE:{
            YEAR: "연도"
        }
    },
    
    CREATE_RAW_DATA : {
        CREATE:{
            START_DATE : "시작일",
            END_DATE : "종료일",
            TIP : "참고사항",
            TIP_TEXT : "※ 종료일 다음날 6시 까지 출입 기록 필요\n ex) 종료일이 2015-01-15 일 경우  \n 2015-01-16 06:00 까지 출입기록 필요",
            DATE_ERR_MSG : "시작일이 종료일보다 큽니다."
        }
    }
});