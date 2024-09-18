import React from 'react'

function Hero() {
  return (
    <div>
        <section className="mt-24 mx-auto max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
                <div className="space-y-4 flex-1 sm:text-center lg:text-left">
                    <h1 className="text-gray-800 font-bold text-4xl xl:text-5xl">
                        Optimize your Ride With our
                         <span className="text-indigo-600"> R K Bikes</span>
                    </h1>
                    <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
                    Unleash the full potential of your journey with R K Bikes', unmatched performance and comfort.  Ride smarter, ride stronger – R K Bikes transforms every trip into an adventure.
                    </p>
                </div>
                <div className="flex-1 text-center mt-4 lg:mt-0 lg:ml-3">
                    <img src="https://i.pinimg.com/736x/85/38/70/8538705a5617f1fcdd4f2cd26a8b911d.jpg" className="w-full mx-auto sm:w-10/12 h-80 lg:w-full" />
                </div>
            </section>
    </div>
  )
}

export default Hero
