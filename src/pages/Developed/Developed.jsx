import "./Developed.css";

const members = [
  {
    id: "66091338",
    name: "นาย ระพีภัธท ผาพันธุ์",
    tasks:
      "หน้าที่ รับผิดชอบในส่วนของการเพิ่มโพสต์ (AddPost) การจัดการแกลเลอรี่ (Gallery) การกดถูกใจโพสต์ (Like Post) การกดถูกใจความคิดเห็น (Like Comment) การแสดงความคิดเห็น (Comment) การสร้างปุ่มลบโพสต์ (Delete Post) การลบความคิดเห็น (Delete Comment) การลบการตอบกลับ (Delete Reply) การเก็บข้อมูลโพสต์ใน LocalStorage การเปลี่ยนหน้าสำหรับการแสดงภาพเมื่อมีจำนวนภาพมากเกินไป การสร้างปุ่มแชร์ (Share) การเชื่อมต่อกับหน้า Activity และการฟิลเตอร์แฮชแท็ก",
      image: "https://cdn.discordapp.com/attachments/1282619933284372500/1297893917819408447/stdempimg.png?ex=674cfa27&is=674ba8a7&hm=54a29837d709090ed4e69eaa2488b654cdad9c44265176487b4e7f7d067dd9ba&",
  },
  {
    id: "66074006",
    name: "นาย ณัฐนนท์ สำราญใจ",
    tasks:
      "หน้าที่ รับผิดชอบในส่วนของการพัฒนาหน้าล็อคอิน/ล็อคเอ้าท์ รวมถึงการทำงานกับ localStorage เพื่อเก็บข้อมูลผู้ใช้และการจัดการสิทธิ์ (Permission) สำหรับผู้ใช้ประเภทต่าง ๆ เช่น guest, member, และ admin",
      image: "https://cdn.discordapp.com/attachments/1282619933284372500/1297894816763482122/4a6598beca619e47.jpeg?ex=674cfafe&is=674ba97e&hm=312c661e3b97db9382ffda03b7a00ef4a1899fafec73efa5fe088a9c2988efcc&",
  },
  {
    id: "66086480",
    name: "นาย สมาวิทย์ ธีรกุลชัยกิจ",
    tasks:
      "หน้าที่ รับผิดชอบในส่วนของการออกแบบและจัดการเลย์เอาต์ของหน้า Home รวมถึงการจัดทำเว็บ HTML และการพัฒนาหน้า Admin เพื่อให้สามารถจัดการข้อมูลต่าง ๆ ได้อย่างมีประสิทธิภาพ",
      image: "https://cdn.discordapp.com/attachments/1282619933284372500/1297898133409366107/stdempimg.png?ex=674cfe14&is=674bac94&hm=f8f58347b0a9c76b4b504e99318f19d977c11ac1aefbcc50518165b038cd37f7&",
  },
  {
    id: "66080853",
    name: "นาง สาวญาณิศา อินทรวิชา",
    tasks:
      "หน้าที่ รับผิดชอบในส่วนของการพัฒนาหน้า Add Activity และหน้า Admin รวมถึงการออกแบบ Wireframe โดยใช้ Figma และการจัดทำเอกสารข้อมูล",
      image: "https://cdn.discordapp.com/attachments/1282619933284372500/1297894172467925033/IMG_6094.jpg?ex=674cfa64&is=674ba8e4&hm=22d7ae5195385c79328ef543bfd4db605dead645a491674ed75f5dd1f1455baa&",
  },
];

function Developed() {
  return (
    <div className="developed">
      <header className="member-title">
        <h1>YAMAHA Social Project</h1>
        <p>สมาชิกของกลุ่มที่ 4</p>
      </header>
      <section>
        {members.map((member) => (
          <div className="member-card" key={member.id}>
            <img
              src={member.image}
              alt={`ภาพของ ${member.name}`}
              className="member-image"
            />
            <h2>{member.name}</h2>
            <p>รหัสนักศึกษา: {member.id}</p>
            <p>{member.tasks}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Developed;
