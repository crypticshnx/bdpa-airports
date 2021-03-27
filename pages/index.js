import Head from 'next/head'
import { loadFirebase } from '../lib/db.js'
import React from 'react'
import Layout from '../components/layout'
// import '../lib/date'

export async function getStaticProps() {
    let firebase = await loadFirebase()
    let result =
        await firebase.firestore().collection('flights')
            .limit(10)
            .get()
            .then(snapshot => {
                let data = []
                snapshot.forEach(doc => {
                    data.push(Object.assign({
                        id: doc.id
                    }, doc.data()))
                })
                return data
            })
    console.log(result)
    return { props: { flights: result } }
}

export default class Index extends React.Component {
    render() {
        const flights = this.props.flights.slice()
        return <Layout >
            <Head>
                <title> BDPA Flights </title>
            </Head>
            <h1> BDPA Flights </h1> {
                (flights && flights.length > 0) ?
                    <div className="flight-list" > {
                        flights.map(flight =>
                            <div key={flight.id} className="card shadow-1" >
                                <h4>{flight.airline}</h4>
                                <div className="separator" >
                                    <p> $ {flight.seatPrice} </p>
                                    <button className="view-btn"> View Flight </button>
                                </div>
                                <div className="flight-overview">
                                    <div className="schedule">
                                        <div className="start">
                                            <p>{flight.departFromSender}</p>
                                            <p>{flight.comingFrom}</p>
                                        </div>
                                        <div className="divider">
                                                <p className="p1">{flight.hours}</p>
                                                <p>Non-stop</p>
                                            </div>
                                        <div className="end">
                                            <p>{flight.arriveAtReceiver}</p>
                                            <p>{flight.landingAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div> : <p> <strong> No flight data available </strong> </p>
            }
            <hr />
        </Layout>
    }
}