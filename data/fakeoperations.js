const paths = [

  {
    path: '/users/:userId/accounts/:accountId/:operationId/delete',
    methods: [ 'POST' ],
    middleware: [ 'newFn' ]
  }
]