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
