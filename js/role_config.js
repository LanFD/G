var roles;
var rolePath = 'role/';
roles        = {
    Atia: {
        path: rolePath + 'role1/'
    },
    Assassin: {
        path: rolePath + 'role2/'
    },
    Leimu:{
        path: rolePath + 'role3/'
    },
    getRoleByName:function(x){
        return this[x];
    }
};
