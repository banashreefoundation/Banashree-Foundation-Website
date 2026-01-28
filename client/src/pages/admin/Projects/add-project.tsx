import SharedChips from '@/components/ui/chips'

const AddProjects = ({ formData, setFormData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));

        console.log(`Updated form data = ${formData.name}`)
      };

    return <div className="flex">
        <div className="flex-none w-full font-cisco-sans-medium">
            <form className="flex flex-col">
                <div className="w-full flex flex-row">
                    <div className="w-5/12">
                        <div className="text-lg">Project Name*</div>
                        <input className="border w-11/12 px-2 py-2 my-1" type="text" placeholder="Project Name" value={formData.name} name="name" onChange={handleChange}/>
                        <div className="font-cisco-sans-thin text-sm">
                            e.g., “Goshala Development Project,” “Dog Rescue Center”
                        </div>
                    </div>
                    <div className="w-7/12">
                        <div className="text-lg">Tag Line*</div>
                        <input className="border w-full px-2 py-2 my-1" type="text" placeholder="Tag Line" value={formData.tagline} name="tagline" onChange={handleChange}/>
                        <div className="font-cisco-sans-thin text-sm">
                            Enter catchy one-liner that summarizes the initiative’s goal or impact.
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-row pt-5">
                    <div className="w-5/12">
                        <div className="text-lg">Program*</div>
                        <input className="border w-11/12 px-2 py-2 my-1" type="text" placeholder="Program name" value={formData.program} name="program" onChange={handleChange}/>
                        <div className="font-cisco-sans-thin text-sm">
                            e.g., “Animal Rescue and Welfare”
                        </div>
                    </div>
                    <div className="w-7/12">
                        <div className="text-lg">Project Objective*</div>
                        <input className="border w-full px-2 py-2 my-1" type="text" placeholder="Project Objective" value={formData.objective} name="objective" onChange={handleChange} />
                        <div className="font-cisco-sans-thin text-sm">
                            e.g., “Providing shelter and medical care for rescued animals”
                        </div>
                    </div>
                </div>
                <div className="w-full pt-5">
                    <div className="text-lg">Project Description*</div>
                    <textarea 
                    className="border w-full px-2 py-2 my-1" 
                    placeholder="Detailed explanation of what the initiative is about, its purpose, and its objectives. Include the background or context of why the initiative was started." 
                    value={formData.description} 
                    name="description" 
                    onChange={handleChange}
                    />
                </div>
                <div className="w-full pt-5">
                    <div className="text-lg">Target Beneficiaries*</div>
                    <input className="border w-full px-2 py-2 my-1" type="text" placeholder="Target Beneficiaries" value={formData.beneficiaries} name="beneficiaries" onChange={handleChange}/>
                    <div className="font-cisco-sans-thin text-sm">
                        Specific goals or outcomes the initiative aims to achieve (e.g., planting 10,000 trees, educating 500 children, etc.).
                    </div>
                </div>
                <div className="w-full flex flex-row pt-5">
                    <div className="w-5/12">
                        <div className="text-lg">Project Location*</div>
                        <input className="border w-11/12 px-2 py-2 my-1" type="text" placeholder="Project Location" value={formData.city} name="city" onChange={handleChange}/>
                        <div className="font-cisco-sans-thin text-sm">
                            Address of project
                        </div>
                    </div>
                    <div className="w-7/12">
                        <div className="text-lg mb-1">Key Activities*</div>
                        <SharedChips placeholder='Key Activities' onChangeHandler={handleChange} name="keyActivities" value={formData.keyActivities}></SharedChips>
                    </div>
                </div>
            </form>
        </div>
    </div>
}
export default AddProjects