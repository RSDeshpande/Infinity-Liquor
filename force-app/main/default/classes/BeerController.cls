public with sharing class BeerController {


    //Method to get cartId of active cart of current logged in user
    @AuraEnabled 
    public static string getCartId(){
        List<cart__c> cartInfo =[select
                                    Id,
                                    Name
                                    from cart__c where user__c = :UserInfo.getUserId()
                                    and cart_status__c = 'Open' 
                                    and Is_Active__c= true];
        if(cartInfo.size()>0){
            return cartInfo.get(0).Id;
        }
        else{
            Cart__c defaultCart = new Cart__c();
            //defaultCart.cart_Id__c = String.valueOf(Math.floor(Math.random()*1000));
            defaultCart.cart_Status__c = 'Open';
            defaultCart.Is_Active__c = true;
            defaultCart.Coupon__c = 'a055i00000BhDuSAAV';
            defaultCart.User__c = UserInfo.getUserId();
            insert defaultCart;
            return defaultCart.Id;
        }
    }

    //method to create cartItem 
    @AuraEnabled
    public static string createCartItems(String CartId, String BeerId, Decimal Amount){
        Cart_Item__c item = new Cart_Item__c();
        Map<Id, Cart_Item__c> cartItemMap = getCartItems(CartId);
        if(cartItemMap.containsKey(BeerId)){
            item = cartItemMap.get(BeerId);
            item.Item_Quantity__c = item.Item_Quantity__c+1;
            item.Item_Amount__c = item.Item_Amount__c + Amount;
            update item;
        }
        else{
            item.Beer__c = BeerId;
            item.Cart__c = CartId;
            item.Item_Quantity__c = 1;
            item.Item_Amount__c = Amount;
            insert item;
        }
        
        return item.Id;
    }

    //method to return map of beerID and cartItem
    public static Map<Id, Cart_Item__c> getCartItems(String cartId){
        Map<Id, Cart_Item__c> cartItemMap = new Map<Id, Cart_Item__c>();
        List<Cart_Item__c> cartItemList = new List<Cart_Item__c>([Select Id, Beer__c, Cart__c, Item_Amount__c, 
                                                                Item_Quantity__c from Cart_Item__c where Cart__c =:cartId]);
        for(Cart_Item__c cItem:cartItemList ){
            cartItemMap.put(cItem.Beer__c, cItem);
        }

        return cartItemMap;
        
    }

    @AuraEnabled (cacheable=true)
    public static List<sObject> searchBeer(String searchParam){
        string key = '%'+searchParam+'%';
        string searchQuery = '';
        if(searchParam != null){
            searchQuery = 'Select Id,Name, Alcohol__c, brewery_name__c, Id__c, Price__c,Remaining_Quantity__c, Tags__c,Total_Quantity__c From Beer__c where Name like :key limit 20';

        }
        else{
            searchQuery = 'Select Id,Name, Alcohol__c, brewery_name__c, Id__c, Price__c,Remaining_Quantity__c, Tags__c,Total_Quantity__c From Beer__c limit 20';
        }

        List<sObject> sObjectList = Database.query(searchQuery);
        return sObjectList;
    }
}
