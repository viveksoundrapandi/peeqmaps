
angular.module('emailForm',[])
.controller('mail_controller',function($scope,$http){

$scope.sendEmail=function(sender_name,sender_email,sender_subject,sender_message){
	
$http({method:'GET', url:'sendMail.php', params:{name: sender_name, email: sender_email, subject:sender_subject, message:sender_message}})
	.success(function(data){
		
		alert("Mail has been Send....");
		$("#contactMail").slideToggle();
		
	 }).error(function(data){

	 });
 
}
});
