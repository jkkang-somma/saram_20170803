define({
    DIALOG:{
       TITLE:{
           PRIMARY:"Info",
           DEFAULT:"Info",
           WARNING:"Warning",
           INFO:"Info",
           ERROR:"Error",
           USER_ADD:"Registration User",
           USER_UPDATE:"Edit User"
       },
       BUTTON:{
           OK:"OK",
           CANCEL:"Cancel",
           ADD:"Add",
           SAVE:"Save",
           CLOSE:"Close",
           INIT_PASSWORD:"Initialize password"
       }
    },
    USER:{
        NAME:"Name",
        ID:"Id",
        DEPT:"Department",
        NAME_COMMUTE:"Commute Name",
        JOIN_COMPANY:"Join Date",
        LEAVE_COMPANY:"Leave Date",
        PRIVILEGE:"Privilege",
        ADMIN:"Admin",
        PASSWORD:"Password",
        NEW_PASSWORD:"New Password",
        RE_NEW_PASSWORD:"Re New Password",
        POSITION:"Position",
        EMAIL:"Email",
        PHONE:"Phone",
        APPROVAL_NAME:"Approval Manager",
        IP:"IP",
        OFFICE_IP:"Office IP",
        PHONE_OFFICE:"Office Phone",
        BIRTHDAY:"Birthday",
        WEDDING_DAY:"Wedding Day",
        EMERGENCY_PHONE:"Emergency Phone",
        MEMO:"Memo",
        MAC:"Mac"
    },
    GRID:{
        MSG:{
            NOT_SELECT_ROW:"Plese Select Row."
        }
    },
    PAGE:{
        TITLE:{
            USER_MANAGER:"User Manager"
        },
        SUB_TITLE:{
            USER_LIST:"User List"
        }
    },
    
    //CODE
    CODE:{
        PRIVILEGE_1:"ALL",
        PRIVILEGE_2:"TEAM",
        PRIVILEGE_3:"USER",
        ADMIN_0:"USER",
        ADMIN_1:"MANAGER",
        ALL:"ALL",
        LEAVE_USER:"Leave",
        WORKER:"Worker",
        POSITION:{
            BOSS:"대표이사",
            VICE_PRESIDENT:"부사장",
            EXECUTIVE_DIRECTOR:"상무이사",
            DIRECTOR:"부장",
            VICE_CHIEF:"차장",
            SECTION__CHIEF:"과장",
            DEARI:"대리",
            WORKER:"사원",
            TOP_SEAT:"수석 연구원",
            MIDDLE_SEAT:"책임 연구원",
            SEAT:"선임 연구원",
            RESEARCHER:"연구원"
        }
    },
    
    
    //MSG
    SUCCESS:{
        USER:{
            SAVE:"Success Save User.",
            REMOVE:"Success Remove User.",
            ADD:"Success Add User."
        },
        LOGIN:{
            SUCCESS_INIT_PASSWORD:"Success Initialize Password."
        }
    },
    WARNING:{
        LOGIN:{
            NOT_VALID_LOGIN_INFO:"Check your Login Info.",
            INIT_PASSWORD_PUT:"Init password.",
            DO_NOT_FOUND_USER:"Not valid account.",
            NOT_EQULES_PASSWORD:"Not valid account.",
            INIT_PASSWORD:"Initialize password.",
            FIND_PASSWORD_PUT:"Check your find Login Info.",
            NOT_VALID_EMAIL:"Not valid Email.",
            ERROR_FIND_PASSWORD_SEND_MAIL:"Fail Request find Password.",
            NOT_EQULES_EMAIL:"Worng Email Info."
        },
        USER:{
            NOT_EQULES_CONFIG_PASSWORD:"Not valid new password."
        }
    },
    ERROR:{
        AUTH:{
            EXPIRE_AUTH:"Session has expired."
        },
        HTTP:{
            NOT_FIND_PAGE:"Not find page.",
            SERVER_DIE:"Service Down. Manager call."
        },
        USER_EDIT_VIEW:{
            FAIL_RENDER:"Fail Load User Data.",
        }
    },
    CONFIRM:{
        USER:{
            REMOVE:"Do you want remove User?"
        }
    },
    
    //MENU
    MENU:{
        TOP:{
            SM:"Security Manager",
            AM:"Attendance Manager"
        },
        SUB:{
            SM:{
                USER:"User Manager",
                HOLIDAY:"Holiday Manager",
                VACATION:"Vacation Manager"
            },
            AM:{
                ADD_RAW_DATA:"Add Raw Data",
                RAW_DATA_LIST:"Raw Data List",
                CREATE_DATA:"Create Commute Data",
                COMMUTE_MANAGER:"Commute Data Manager",
                COMMUTE_MANAGER_COMMENT:"Commute History Manager",
                REPORT_MANAGER:"Commute Report"
            }
        }
    },
    
    //단위
    UNIT:{
        WON:"Won",
        DAY:"Day",
        MONTH:"Month",
        YEAR:"Year",
        HOURE:"Houre",
        MIN:"Min",
        SEC:"Sec"
    },
    
    DASHBOARD:{
        WORKING_SUMMARY:{
            ID:"Id",
            NAME:"Name",
            TOTAL_OVERTIEM_PAY:"Total over time pay",
            TOTAL_WORKING_DAY:"Total working day",
            VACATION:"Vaction",
            NIGHT_WORKING_A:"Night WORKTYPE A",
            NIGHT_WORKING_B:"Night WORKTYPE B",
            NIGHT_WORKING_C:"Night WORKTYPE C",
            HOLIDAY_WORKING_A:"Holiday WORKTYPE A",
            HOLIDAY_WORKING_B:"Holiday WORKTYPE B",
            HOLIDAY_WORKING_C:"Holiday WORKTYPE C",
            PERCEPTION:"Perception",
            SICK_LEAVE:"Sick Leave",
            ABSENTEEISM:"Absenteeism"
        }    
    },
    COMMENT: {
    	STATE: {
    		ALL : "All",
    		ACCEPTING : "Accepting",
    		PROCESSING : "Processing",
    		COMPLETE : "Complete"
    	}
    },
    
    TOOLTIP: {
        USER:{
            TYPE:"User Type",
            ADD:"User Add",
            EDIT:"User Edit",
            REMOVE:"User Remove"
        }
    },
    
    SUB_TITLE:{
        DETAIL_INFO:"Detail Info",
        REQUIRE_INFO:"Require Info"
    },
    
    //로그인
    LOGIN_VIEW:{
        TITLE:"Yescnc Attendance Management",
        ID_PLACEHOLDER:"ID",
        PASSWORD_PLACEHOLDER:"PASSWORD",
        LOGIN_SATUS_BTN:"login..",
        LOGIN_BTN:"LOGIN",
        FIND_PASSWORD_TEXT:"for get me password "
    },
    INIT_PASSWORD_VIEW:{
        TITLE:"Password Cofing",
        NEW_PPASSWORD_PLACEHOLDER:"New Password",
        RE_PPASSWORD_PLACEHOLDER:"Re Password",
        INIT_PASSWORD_STATUS_BTN:"Save..",
        INIT_PASSWORD_BTN:"Save Password"
    },
    FIND_PASSWORD_VIEW:{
        TITLE:"Password Find`",
        EMAIL_PLACEHOLDER:"E-mail",
        FIND_PASSWORD_STATUS_BTN:"finding..",
        FIND_PASSWORD_BTN:"Find Password",
        FIND_TEXT_INFO:"※  Check you are Login Info."
    }
});