let process = require('process') 
let moduleProduct = require('./logica/logicProduct');
let comando = process.argv[2];
​
switch (comando) {
​
    case 'listar':
        let products = moduleProduct.readJSON();
​
        if (products.length === 0) {
            console.log("no hay productos")
        } else {
            
            console.log("----------------------------")
            console.log("listado de productos")
            console.log("----------------------------")
​
            for(p in products ){
​
                console.log("id: " + products[p].id + 
                            " name: " +  products[p].name + 
                            " price " + products[p].price )           
            }
        }
        break;
    case 'agregar':
​
        let id =    parseInt (process.argv[3]);
        let name =  process.argv[4];
        let price = parseInt(process.argv[5]);
  
        moduleProduct.addToJson(id,name,price)
        break
​
    case 'filtrar':
        let min =  (process.argv[3]);
        let max =  (process.argv[4]);
    
        let productFil = moduleProduct.filterProduct(min,max);
​
        if (productFil.length === 0) {
            console.log("no hay productos")
        } else {
            
            console.log("----------------------------")
            console.log("listado de productos")
            console.log("----------------------------")
​
            for(p in productFil ){
​
                console.log("id: " + productFil[p].id + 
                            "name: " +  productFil[p].name + 
                            "price " + productFil[p].price )           
            }
        }
        
        break
    case 'modificar':
​
        let idP =  parseInt(process.argv[3]);
        let priceP = parseInt (process.argv[4]);
        moduleProduct.modifyProduct(idP, priceP); 
​
        break
    case 'eliminar': 
​
        let idProductElim =  parseInt(process.argv[3]);
        let { statusP } = moduleProduct.deleteProduct(idProductElim);
        
        
        if(!statusP){
            console.log("----------------------------")
            console.log(`No se encontro el producto con id ${idProductElim}`);
            console.log("----------------------------")
        }
       
​
        break
    case 'buscar':
        
        let idPSearch =  parseInt(process.argv[3]);
        let {statusS, producto } = moduleProduct.searchProduct(idPSearch);
​
        if(statusS){
            console.log("----------------------------")
            console.log(`id = ${producto.id} `);
            console.log(`name = ${producto.name} `);
            console.log(`price = ${producto.price} `);
            console.log("----------------------------")
        }else{
            console.log("----------------------------")
            console.log(`No se encontro el producto con id ${idPSearch}`);
            console.log("----------------------------")
        }
​
        break
    default:
        break;
}
 /*============================================================================*/
​
let fs = require('fs');
​
module.exports = modulProduct = {
​
    archivo : './product.json',
    readJSON : function () {
        let listProducts = fs.readFileSync(this.archivo,'utf-8');
        return JSON.parse(listProducts)
    },
    addToJson : function (id,name,price) {
​
        let product = {
            id : id,
            name : name,
            price : price 
        }
​
        let previousProducts = this.readJSON();
        previousProducts.push(product);  
        this.saveJson(previousProducts)
    },
​
    saveJson :function ( json) {
        let newJSON = JSON.stringify(json);
        fs.writeFileSync(this.archivo,newJSON,'utf-8')
    },
​
    filterProduct :function(min, max) {
​
        let arrayProduct = this.readJSON();    
        let result = arrayProduct.filter( product  => product.price >= min && product.price <= max )
               
            return result
    },
    modifyProduct :function  (id, price) {
​
        let arrayProduct = this.readJSON();  
​
        let idProduct = arrayProduct.findIndex( product  => product.id == id )
        let product = arrayProduct[idProduct]
        product.price = price
     
        arrayProduct.splice(idProduct, 1, product);    
        this.saveJson(arrayProduct)
        
    },
    deleteProduct : function (id)  {
          
            let arrayProduct = this.readJSON();       
            let newArrayProduc = arrayProduct.filter(product => product.id !== id);
         
            if (arrayProduct.length === newArrayProduc.length) {
                return {
                    statusP: false
                };
            } 
            else {
​
                this.saveJson(newArrayProduc);
                return {
                    statusP : true
                };
            }
        
    },
    searchProduct : function (id){
        let arrayProduct = this.readJSON();       
        let idProduct = arrayProduct.findIndex( product  => product.id == id )
​
        let productSearch = arrayProduct[idProduct];
    
        if (idProduct >= 0){
            return {
                statusS : true,
                producto : productSearch
            };
        }
        else{
            return {
                statusS : false,
                producto : null
            };
        }
        
    }
  
