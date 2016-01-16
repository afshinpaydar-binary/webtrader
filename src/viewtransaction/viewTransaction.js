﻿/**
 * Created by amin on January 14, 2016.
 */

define(["jquery", "windows/windows", "websockets/binary_websockets", "common/rivetsExtra", "moment", "jquery-growl", 'common/util'],
  function($, windows, liveapi, rv, moment){

  require(['css!viewtransaction/viewTransaction.css']);
  require(['text!viewtransaction/viewTransaction.html']);

  /* params : { symbol: ,contract_id: ,longcode: ,sell_time: ,
                purchase_time: ,buy_price: ,sell_price:, currency:, } */
  function init(params) {
    require(['text!viewtransaction/viewTransaction.html'],function(html){
        var root = $(html);
        var transWin = windows.createBlankWindow(root, {
            title: 'Transaction ' + params.contract_id, /* TODO: use symbol_name instead */
            width: 700,
            minHeight:90,
            destroy: function() { },
            close: function() { view.unbind(); },
            'data-authorized': 'true'
        });

        var state = init_state(params);
        var view = rv.bind(root[0],state)

        transWin.dialog('open');
    })
  }

  function init_state(params){
      var state = {
          route: {
              value: 'table',
              update: function(value) { state.route.value = value; }
          },
          longcode: params.longcode,
          validation: '-',
          table: {
            currency: params.currency ? params.currency + ' ' : 'USD ',
            purchase_time: params.purchase_time && moment.utc(params.purchase_time).format('YYYY-MM-DD HH:mm:ss'),
            now: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
            sell_time: params.sell_time && moment.utc(params.sell_time).format('YYYY-MM-DD HH:mm:ss'),

            entry_spot: undefined,
            current_spot: undefined,
            exit_spot: undefined,

            purchase_price: params.buy_price && (params.buy_price*1).toFixed(2),
            indicative_price: undefined,
            final_price: params.sell_price && (params.sell_price*1).toFixed(2),
          },

      };

      liveapi.send({proposal_open_contract: 1, contract_id: params.contract_id})
             .then(function(data){
               // TODO: fix this
               state.validation = 'This contract has expired';
             })
             .catch(function(err){
               console.error(err);
             });

      return state;
  }

  return { init: init };
});
