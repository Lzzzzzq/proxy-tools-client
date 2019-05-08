const carlo = require('carlo');
const socketInit = require('./lib/socket')
const portfinder = require('portfinder')

const init = async () => {
  try {
    const port = 3000

    portfinder.basePort = port
    portfinder.getPort(async function (err, port) {
      if (err) { throw err }

      console.log('')
      console.log(`Port -> ${port}`)
      console.log('')
      console.log('请勿关闭当前窗口')
      console.log('')

      process.env.socketPort = port
      
      socketInit(port)
      
      if (process.env.NODE_ENV !== 'development') {

        // Launch the browser.
        const app = await carlo.launch({
          width: 1366,
          height: 768
        });
    
        // Terminate Node.js process on app window closing.
        app.on('exit', () => process.exit());
    
        // Tell carlo where your web files are located.
        app.serveFolder(__dirname);

        // Expose 'env' function in the web environment.
        await app.exposeFunction('env', _ => process.env);

        // Navigate to the main page of your app.
        await app.load('./view/dist/index.html');

      }
    })
  } catch (e) {
    // console.log('Error: ', e)
  }

}

init()

process.on("uncaughtException", function (err) {
  // console.error('An uncaught error occurred!');
  // console.error(err.stack);
})