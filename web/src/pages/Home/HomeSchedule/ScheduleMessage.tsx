export default function ScheduleMessage({ message }: { message: string }) {
  return (
    <tr>
      <td style={{ textAlign: "center", fontSize: "1.07em", padding: "15px" }}>
        {message}
      </td>
    </tr>
  );
}
