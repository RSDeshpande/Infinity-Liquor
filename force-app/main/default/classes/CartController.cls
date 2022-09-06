public with sharing class CartController {
   
    @AuraEnabled
    public static List<sObject> getCart(String CartId){
        List<Cart__c> cartList = [select Id,
                Cart_Status__c,
                Is_Active__c,
                Name,
                Total_Amount__c,
                User__c
                from Cart__c where Id= :cartId and Cart_Status__c ='Open' and Is_Active__c= true  ];
        return cartList;
    }

    @AuraEnabled
    public static string getAllCartItems(String CartId){
        List<Cart_Item__c> cartItemList =[Select Name, Beer__c,Beer__r.Price__c, Item_Amount__c,Beer__r.Name, Item_Quantity__c from Cart_Item__c
                            where Cart__c =:CartId ];
        return JSON.serialize(cartItemList);
    }

    @AuraEnabled
    public static List<Address_Book__c> getAllAddresses(){
       List<Address_Book__c> addresses = [select City__c, Country__c, State__c, Street__c,Postal_Code__c, User__c 
                from Address_Book__c where User__c!=null and User__c = :UserInfo.getUserId() ];  
        return addresses;  
    }

    @AuraEnabled
    public static Address_Book__c saveNewAddress(String newAddress){
        Address_Book__c newAddressInfo = (Address_Book__c)JSON.deserialize(newAddress, Address_Book__c.class);

        newAddressInfo.User__c = UserInfo.getUserId();
        insert newAddressInfo;
        return newAddressInfo;
    }

    @AuraEnabled
    public static Order__c placeOrder(string cartId, string AddressId){
       
        Order__c newOrder = new Order__c();
        newOrder.Shipping_Address__c = AddressId;
        newOrder.User__c = UserInfo.getUserId();
        newOrder.Cart__c= cartId;

        insert newOrder;

        return newOrder;
    }
}
