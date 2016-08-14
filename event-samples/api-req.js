// Sample event data

var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var pdf = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(pdf).toString('base64');
}
// convert file to base64 encoded string
var base64str = base64_encode(__dirname+'/test.pdf');

module.exports = {
    name: "Alffeinne Klaussensonschmidtberg",
    email: "info@foobarensemble.com",
    confirm_email: "info@foobarensemble.com",
    phone: "123456789",
    discipline: "Nisi ipsum ut in magna nisi minim culpa velit.",
    bio: "Anim ex culpa qui nulla non non tempor deserunt occaecat velit ut aliquip incididunt laborum. Non nisi laboris laboris aute ea, culpa exercitation pariatur excepteur ullamco non sunt. Est eu magna commodo incididunt sit cillum consectetur excepteur velit magna minim ullamco eiusmod nisi fugiat aute mollit. Consequat eu nostrud est Lorem ad voluptate velit nisi tempor ex nulla proident id exercitation ullamco anim. Pariatur ex magna eiusmod quis laboris occaecat ut ut cupidatat id dolore sunt do ex. Eu Lorem commodo est irure enim tempor proident officia cillum occaecat deserunt.",
    cv: [
      {
        "type": "application/pdf",
        "name": "cv.pdf",
        "body": base64str
      }
    ],
    project_title: "Foobar Ensemble",
    short_description: "Ullamco mollit adipisicing non est amet cupidatat consequat pariatur amet incididunt ad cillum ut nisi proident., Qui anim ea aliqua ea ullamco esse anim consequat esse in nostrud deserunt excepteur minim. Non velit magna voluptate voluptate tempor et labore ea cupidatat ex. Fugiat laborum consectetur consequat ullamco nostrud proident incididunt do proident aliquip sunt.",
    long_description: "Est consectetur sunt ipsum dolore et reprehenderit adipisicing et enim non officia proident tempor magna aliquip, aute. Nisi irure fugiat incididunt do sint aute ipsum. Culpa irure tempor ad ipsum duis veniam laboris enim nisi laborum minim magna fugiat.\n\nDolor labore anim adipisicing officia occaecat elit ex ex. Sit ipsum ipsum adipisicing deserunt quis deserunt tempor in quis. Est cupidatat cillum proident aliqua et esse aute. Incididunt pariatur esse fugiat id Lorem aute aute nostrud elit eu elit. Mollit in fugiat do velit laborum est do aute voluptate occaecat. Ad sit quis ea mollit id anim pariatur minim fugiat. Dolor Lorem proident pariatur ut est esse aliquip culpa adipisicing. Ipsum eu non dolore elit culpa labore nostrud reprehenderit quis tempor sint dolor cillum nulla.\n\nNon ex labore eiusmod laborum elit et enim dolor tempor sint minim anim. Eu dolore ipsum laboris duis velit ullamco exercitation officia aute amet deserunt duis exercitation quis eu elit. Cillum nulla voluptate exercitation irure sunt eiusmod reprehenderit cupidatat fugiat adipisicing qui. Incididunt ut ullamco et mollit aliqua nulla occaecat aliqua velit irure sit ullamco. Qui officia dolor ut exercitation cillum occaecat sint nostrud quis adipisicing. Minim quis occaecat occaecat Lorem elit cupidatat dolor sit veniam. Consequat culpa irure qui fugiat id dolore nisi officia excepteur. \n\nLaboris exercitation aliqua aliqua proident velit et laboris. Aute labore velit voluptate nisi ipsum nisi excepteur nisi duis ipsum adipisicing do eiusmod irure sit quis in. Commodo exercitation mollit mollit sint in incididunt quis voluptate enim consequat incididunt minim. Minim aliquip quis veniam adipisicing in officia quis reprehenderit ad Lorem pariatur magna irure eu excepteur do do. Nisi consectetur veniam ipsum et aute ipsum exercitation non.",
    technical_requirements: "PA\n\nHot air balloon\n\nIrure deserunt incididunt elit duis aute dolore cillum et consectetur in officia ad, minim.",
    instrumentation: "Tuba, foghorn, hot air balloon",
    funding: "Creative Victoria",
    focus_areas: "Trans performers",
    comments: "Anim proident magna occaecat eu dolore sint veniam veniam laborum eu voluptate sint occaecat."
};
