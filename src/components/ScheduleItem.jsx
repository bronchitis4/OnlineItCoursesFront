const ScheduleItem = ({ item }) => {
    return (
      <tr>
        <td>{item.date}</td>
        <td>{item.time}</td>
        <td>{item.course}</td>
        <td>{item.teacher}</td>
      </tr>
    );
  };
  
  export default ScheduleItem;
  