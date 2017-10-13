 var mysql = require('mysql');
 var inquirer = require("inquirer");

 var connection = mysql.createConnection({
   host: "localhost",
   port:3306,
   user:'root',
   password:"",
   database:'bamazon'
 });

 connection.connect(function(err){
   if(err) throw err;
   console.log('connected as id: ' + connection.threadId + "\n");
   // readData();
   placeOrder();
});

function readData(){
   console.log('Reading Data ...');
   var query = connection.query('SELECT item_id,product_name,price FROM products',function(err,res){
      if(err) throw err;
      for(var i=0; i<res.length; i++){
         console.log('items_id: ' + res[i].item_id + ' | product_name: ' + res[i].product_name + ' | Price: ' + res[i].price);
      }
      connection.end();
   });
}

function placeOrder(){
   inquirer.prompt([
      {
      type: 'input',
      message: "Please provide the ID of the product you are interested:",
      name: "id"
   },{
      type: 'input',
      message: "How many units of the product they would like to buy?",
      name: "stock_quantity"
      }
   ]).then(function(answer){
      var query = connection.query('SELECT stock_quantity,price FROM products WHERE ?',{
         item_id: answer.id
      },function(err,res){
         console.log("Go ahead and place your order please.");
         var qty = res[0].stock_quantity - answer.stock_quantity;
         if(answer.id, answer.stock_quantity <= res[0].stock_quantity){
            console.log("Ready to Checkout");
            updateQuantity(qty, answer.id);
            console.log('Please pay: $' + answer.stock_quantity * res[0].price );
         }else{
            console.log("Insufficient quantity!");
            updateQuantity(qty, answer.id);
         }
      });
   });
}

function updateQuantity(qty,id){
   var query = connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[qty,id],function(err,res){
      if(err) throw err;
      // console.log('Updated Rows: ', res.affectedRows);
   });
}
