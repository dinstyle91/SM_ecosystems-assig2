var num1 = document.getElementById('num-one');
var num2 = document.getElementById('num-two');
var sum = document.getElementById('add-sum');
// So in order to get the value from a user we will add a listener to it:
// First argument is the event that occurs "click"/"mouseenter"/"mouseleave"/"focus" 
// and  the second is the function that will run whenever this event occurs.
num1.addEventListener("click", function(){	
	console.log("hello");	
}); // events can be: click, mouseenter, mouseleave, focus, mousedown, mouseup
// keydown, keyup, blur, input: when anything changes in a value
// another, better way of writing the function:


num1.addEventListener("input", add);
num2.addEventListener("input", add);// it's simpler to add the function for other fields


function add(){	
		var one = parseFloat(num1.value) || 0;// || 0 in case there is a null/NaN 
		var two = parseFloat(num2.value) || 0;
		sum.innerHTML = one+two; 
}