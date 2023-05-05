import React from 'react'
import Image from 'next/image'

function AsanaCard(props) {
    return (
        <div>

            <div className="block rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-xl sm:p-6 lg:p-8 h-64" >


                <div className="card-body">
                    <div key="title" className='flex flex-row gap-5 items-center'>
                        {/* <Image src="/AvatarMaker.png" width={50} height={50} className='rounded-full'/> */}
                    <h2 className="card-title ">{props.name}</h2>

                    {props.section === "Inbox" ?
                        <div className="badge badge-neutral my-2">{props.section}</div>
                        :
                        props.section === "Backlog" ? <div className="badge badge-primary my-2">{props.section}</div>

                        :
                        props.section === "Sprint" ? <div className="badge badge-secondary my-2">{props.section}</div>
                        :
                        props.section === "Testing" ? <div className="badge badge-warning my-2">{props.section}</div>
                        :
                        props.section === "Done" ? <div className="badge badge-accent my-2">{props.section}</div>
                        :
                         ""
                    }
                    {props.department === "seo" ?
                        <div className="badge badge-info badge-outline my-2">{props.department}</div>
                        :
                        props.department === "growwer" ? <div className="badge badge-info badge-outline my-2">{props.department}</div>

                        :
                        props.department === "ppc" ? <div className="badge badge-info badge-outline my-2">{props.department}</div>
                        :
                        props.department === "cro" ? <div className="badge badge-info badge-outline my-2">{props.department}</div>
                        :
                        props.department === "otros" ? <div className="badge badge-info badge-outline my-2">{props.department}</div>
                        :
                         ""
                    }    



                    </div>
                    <p>{props.notes}</p>
                    <div className="card-actions justify-end">

                    </div>
                </div>
            </div>

        </div>
    )
}

export default AsanaCard