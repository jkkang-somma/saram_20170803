INSERT INTO approval_tbl 
(doc_num, submit_id, manager_id, submit_date, decide_date, submit_comment, decide_comment, start_date, end_date, office_code, state) VALUES 
(
'2014-10-30-01', 
'100501',    
'060601',     
'2014-10-30 11:15:11', 
'2014-11-30 09:01:22', 
'휴가 상신합니다.', 
'수락합니다.',    
'2014-11-10', 
'2014-11-11', 
'V01', 
'결제완료');


INSERT INTO `out_office_tbl` 
  (`year`, `date`, `id`, `office_code`, `day_count`, `memo`, `doc_num`) 
VALUES 
  ('2014', '2014-11-10', '100501', 'V01', 1.0, '', '2014-10-30-01');
  
INSERT INTO `out_office_tbl` 
  (`year`, `date`, `id`, `office_code`, `day_count`, `memo`, `doc_num`) 
VALUES 
  ('2014', '2014-11-11', '100501', 'V01', 1.0, '', '2014-10-30-01');



// 결재 테이블의 고유번호 생성시 사용
UPDATE 
	approval_index_tbl 
SET 
	seq = 1 + 
		( 
			SELECT MAX_VALUE FROM
				( SELECT max(seq) AS MAX_VALUE FROM approval_index_tbl WHERE yearmonth = '201502' ) AS x
        )
WHERE 
	yearmonth = '201502';
	
