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
        PRIVILEGE:"조회 권한",
        ADMIN:"관리 권한",
        PASSWORD:"비밀번호",
        NEW_PASSWORD:"New 비밀번호",
        RE_NEW_PASSWORD:"확인 New 비밀번호"
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
        PRIVILEGE_1:"전체",
        PRIVILEGE_2:"부서",
        PRIVILEGE_3:"개인",
        ADMIN_0:"사용자",
        ADMIN_1:"관리자",
        ALL:"전체",
        LEAVE_USER:"퇴사자",
        WORKER:"근무자"
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
            INIT_PASSWORD:"비밀번호를 설정해주세요."
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
            NOT_FIND_PAGE:"요청한 페이지를 찾을 수 없습니다."
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
                VACATION:"연차 관리"
            },
            AM:{
                ADD_RAW_DATA:"출입 기록 등록",
                RAW_DATA_LIST:"출입 기록 조회",
                CREATE_DATA:"근태 자료 생성",
                COMMUTE_MANAGER:"근태 자료 관리",
                COMMUTE_MANAGER_COMMENT:"근태 Comment 내역 관리",
                REPORT_MANAGER:"근태 상신"
            }
        }
    }
});