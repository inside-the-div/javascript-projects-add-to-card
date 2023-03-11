$(document).ready(function(){
    LoadAllProducts();

    if(localStorage.getItem("cartList_data") != null)
    {
        LoadCartList();
    }
    
    $(document).on("click","#btnCartListclose",function(){
        $(".cart-list").addClass("cart-slide-right");
    });

    $(document).on("click","#btn-cart-list-show-hide",function(){
        $(".cart-list").toggleClass("cart-slide-right");
    });

    //add to cart
    $(document).on("click",".btn-add-to-cart",function(){
        var cartProductId = Number($(this).attr('data-product-id'));
        var productJson = JSON.parse(products);
        var cartListId;
        var cartListJson;
        if(localStorage.getItem("cartList_data") == null || JSON.parse(localStorage.getItem("cartList_data")).cartListArray.length == 0)
        {
            cartListId = 1;
            var cartListArray = [];
            cartListArray.push(         
            {
                "id":cartListId,
                "name":productJson.productData[cartProductId-1].name,
                "quantity":1,
                "price":productJson.productData[cartProductId-1].price,
                "productId":cartProductId
            }
            );
            cartListJson ={
                "cartListArray" : cartListArray
            }
            localStorage.setItem("cartList_data", JSON.stringify(cartListJson));
            $("#alertToaster").html('<p>This product added to cart.</p>');
            $("#alertToaster").addClass('alert-bg-success');
            $("#alertToaster").fadeIn();

            setTimeout(removeAlertToaster, 3000);
            
        }
        else
        {
            var productAlreadyInCartList = false;
            var productJson = JSON.parse(products);
            cartListJson = JSON.parse(localStorage.getItem("cartList_data"));
            for(var i = 0; i < cartListJson.cartListArray.length; i++)
            {
                if(cartProductId == cartListJson.cartListArray[i].productId)
                {
                    productAlreadyInCartList = true;
                }
            }
            if(productAlreadyInCartList)
            {
                
                $("#alertToaster").html('<p>This product already in cart.</p>');
                $("#alertToaster").removeClass('alert-bg-success');
                $("#alertToaster").addClass('alert-bg-error');
                $("#alertToaster").fadeIn();

                setTimeout(removeAlertToaster, 3000);

            }
            else
            {
                var lastIndexOfArray = cartListJson.cartListArray.length-1;
                cartListId = cartListJson.cartListArray[lastIndexOfArray].id + 1;
                cartListJson.cartListArray.push(
                    {
                        "id":cartListId,
                        "name":productJson.productData[cartProductId-1].name,
                        "quantity":1,
                        "price":productJson.productData[cartProductId-1].price,
                        "productId":cartProductId
                    }
                );
                localStorage.setItem("cartList_data", JSON.stringify(cartListJson));
                
                $("#alertToaster").html('<p>This product added to cart.</p>');
                $("#alertToaster").addClass('alert-bg-success');
                $("#alertToaster").fadeIn();

                setTimeout(removeAlertToaster, 3000);
            }
        }
        LoadCartList();
    });

    //delete from cart
    $(document).on("click",".btn-remove-from-cart-list",function(){
        if (confirm("Are you sure, want to delete?") == true) 
        {
            var productId = ($(this).attr('data-product-id'));
            var indexNumber;
            var cartListJson = JSON.parse(localStorage.getItem("cartList_data"));
            var totalCartproducts = cartListJson.cartListArray.length;

            for(var i = 0 ;i < totalCartproducts; i++)
            {
                if(cartListJson.cartListArray[i].productId == productId)
                {
                    indexNumber = i;
                    break;
                }
            }
            cartListJson.cartListArray.splice(indexNumber, 1);
            localStorage.setItem("cartList_data", JSON.stringify(cartListJson));
            $("#alertToaster").html('<p>Product removed from the cart.</p>');
            $("#alertToaster").removeClass('alert-bg-success');
            $("#alertToaster").addClass('alert-bg-error');
            $("#alertToaster").fadeIn();

                setTimeout(removeAlertToaster, 3000);
            LoadCartList();
        }
    });

    //decrese quantity
    $(document).on("click",".btn-product-quantity-minus",function(){
        var productId = ($(this).attr('data-product-id'));
        var indexNumber;
        var cartListJson = JSON.parse(localStorage.getItem("cartList_data"));
        var totalCartproducts = cartListJson.cartListArray.length;
        
        for(var i = 0 ;i < totalCartproducts; i++)
        {
            if(cartListJson.cartListArray[i].productId == productId)
            {
                indexNumber = i;
                break;
            }
        }

        var product = cartListJson.cartListArray[indexNumber];
        var productUnitPrice;
        if(product.quantity > 1)
        {
            productUnitPrice = product.price / product.quantity;
            product.quantity = product.quantity - 1;
            product.price = productUnitPrice * product.quantity;
            localStorage.setItem("cartList_data", JSON.stringify(cartListJson));
            LoadCartList();

            $("#alertToaster").html('<p>Product quantity decress.</p>');
            $("#alertToaster").removeClass('alert-bg-success');
            $("#alertToaster").addClass('alert-bg-error');
            $("#alertToaster").fadeIn();

            setTimeout(removeAlertToaster, 3000);
        }
    });

    //increase quantity
    $(document).on("click",".btn-product-quantity-plus",function(){
                      
        var productId = ($(this).attr('data-product-id'));
        var indexNumber;
        var cartListJson = JSON.parse(localStorage.getItem("cartList_data"));
        var totalCartproducts = cartListJson.cartListArray.length;
        
        for(var i = 0 ;i < totalCartproducts; i++)
        {
            if(cartListJson.cartListArray[i].productId == productId)
            {
                indexNumber = i;
                break;
            }
        }

        var product = cartListJson.cartListArray[indexNumber];
        var productUnitPrice;

        productUnitPrice = product.price / product.quantity;
        product.quantity = product.quantity + 1;
        product.price = productUnitPrice * product.quantity;

        localStorage.setItem("cartList_data", JSON.stringify(cartListJson));
        LoadCartList();

        $("#alertToaster").html('<p>Product quantity incress.</p>');
        $("#alertToaster").addClass('alert-bg-success');
        $("#alertToaster").fadeIn();

        setTimeout(removeAlertToaster, 3000);
});

    //search Product
    $("#searchProduct").keyup(function(){
        var searchText = $("#searchProduct").val();
        searchText = searchText.replace(/\s{2,}/g, ' ').trim();
        searchText = searchText.toLowerCase();
        if(searchText == "")
        {
            LoadAllProducts();
        }
        else
        {
            var productJson = JSON.parse(products);
            var totalproducts = productJson.productData.length;
            var productDivs = "";
            if(productJson != null)
            {            
                for(var i = 0; i < totalproducts; i++)
                {
                    var productTitle = productJson.productData[i].name;
                    productTitle = productTitle.toLowerCase();
                    if(productTitle.indexOf(searchText) > -1)
                    {
                        productDivs += 
                            `<div class = "cart-product">
                                <div class="cart-product-head">
                                    <img src="${productJson.productData[i].image}" alt="product">
                                </div>
                                <div class="cart-product-body">
                                    <h3 class="product-name">${productJson.productData[i].name}</h3>
                                    <div class="product-action">
                                        <p>Price: <span class="product-price">$${productJson.productData[i].price}</span></p>
                                        <button data-product-id="${productJson.productData[i].id}" class="btn-common-project btn-add-to-cart">add to cart</button>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
            }
            $(".cart-products-body").html(productDivs);
        }
    });
});
// end jquery

function LoadAllProducts(){
    var productJson = JSON.parse(products);
    var totalproducts = productJson.productData.length;
    var productDivs = "";
              
    for(var i = 0; i < totalproducts; i++)
    {
        productDivs += 
        `<div class = "cart-product">
            <div class="cart-product-head">
                <img src="${productJson.productData[i].image}" alt="product">
            </div>
            <div class="cart-product-body">
                <h3 class="product-name">${productJson.productData[i].name}</h3>
                <div class="product-action">
                    <p>Price: <span class="product-price">$${productJson.productData[i].price}</span></p>
                    <button data-product-id="${productJson.productData[i].id}" class="btn-common-project btn-add-to-cart">add to cart</button>
                </div>
            </div>
        </div>`;
            
    }
    $(".cart-products-body").html(productDivs);
    
}

function LoadCartList(){
    var cartListJson = JSON.parse(localStorage.getItem("cartList_data"));
    var totalCartproducts = cartListJson.cartListArray.length;
    var productListItems = "";
    var totalPrice = 0;  
    for(var i = 0; i < totalCartproducts; i++)
    {
        totalPrice += cartListJson.cartListArray[i].price;
        productListItems += 
        `<tr>
            <td>${cartListJson.cartListArray[i].name}</td>
            <td class="quantity-column">
                <i data-product-id="${cartListJson.cartListArray[i].productId}" class="fa-solid fa-minus btn-product-quantity-minus"></i>
                <span class="product-quantity">${cartListJson.cartListArray[i].quantity}</span>
                <i data-product-id="${cartListJson.cartListArray[i].productId}" class="fa-solid fa-plus btn-product-quantity-plus"></i>
            </td>
            <td>$${cartListJson.cartListArray[i].price}</td>
            <td>
                <button data-product-id="${cartListJson.cartListArray[i].productId}" class="btn-common-project btn-remove-from-cart-list"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>`;
    }
    $("#productListTableBody").html(productListItems);
    $("#totalCartItems").html(totalCartproducts);
    if(totalCartproducts == 0)
    {
        $("#productCartListFooter").hide();
    }
    else
    {
        $("#productCartListFooter").show();
    }
    $("#totalPrice").html(totalPrice);
    
}

function removeAlertToaster(){
    $("#alertToaster").fadeOut();
}