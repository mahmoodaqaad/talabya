import React from 'react'

const Maps = () => {
    return (
        // هنا حسبنا طول الشاشة الكلي ناقص طول الهيدر العلوي (تقريباً 80px) لمنع السكرول
        <div className='h-[calc(100vh-96px)] p-3 flex flex-col gap-4'>
            <h1 className='text-3xl font-bold text-gray-800'>Maps Page</h1>

            {/* كلاس flex-1 بيخلي حاوية الخريطة تتمدد وتعبّي باقي الصفحة بالظبط */}
            <div className="flex-1 w-full rounded-xl overflow-hidden shadow-lg border border-zinc-800">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.7617464057863!2d34.4332904!3d31.5038096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMwJzEzLjciTiAzNMKwMjYnMDAuOCJF!5e0!3m2!1sar!2s!4v1700000000000!5m2!1sar!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    )
}

export default Maps